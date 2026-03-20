from __future__ import annotations

import json
import os
import threading
import time
from pathlib import Path
from typing import Any
import urllib.error
import urllib.parse
import urllib.request

from flask import Flask, jsonify, request, send_from_directory
import yfinance as yf

try:
    from google import genai
except ImportError:  # pragma: no cover - optional dependency
    genai = None


BASE_DIR = Path(__file__).resolve().parent.parent
INDEX_FILE = BASE_DIR / "index.html"
CACHE_TTL_SECONDS = 300
SEARCH_CACHE_TTL_SECONDS = 120
REQUEST_INTERVAL_SECONDS = 1.0
GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta"


def _load_env_file() -> None:
    env_file = BASE_DIR / ".env"
    if not env_file.exists():
        return
    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if not key:
            continue
        parsed = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, parsed)


_load_env_file()
SERVER_AI_MODEL = os.environ.get("GEMINI_MODEL") or "gemini-3-flash-preview"
FALLBACK_AI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
SERVER_AI_API_KEY = (
    os.environ.get("GEMINI_API_KEY")
    or os.environ.get("GOOGLE_API_KEY")
    or os.environ.get("AI_API_KEY")
    or ""
)

app = Flask(__name__)

_cache: dict[str, tuple[float, Any]] = {}
_search_cache: dict[str, tuple[float, Any]] = {}
_rate_lock = threading.Lock()
_last_request_at = 0.0


def _throttle() -> None:
    global _last_request_at
    with _rate_lock:
        now = time.monotonic()
        elapsed = now - _last_request_at
        if elapsed < REQUEST_INTERVAL_SECONDS:
            time.sleep(REQUEST_INTERVAL_SECONDS - elapsed)
        _last_request_at = time.monotonic()


def _cache_get(store: dict[str, tuple[float, Any]], key: str, ttl_seconds: int) -> Any | None:
    row = store.get(key)
    if not row:
        return None
    cached_at, value = row
    if time.time() - cached_at > ttl_seconds:
        store.pop(key, None)
        return None
    return value


def _cache_set(store: dict[str, tuple[float, Any]], key: str, value: Any) -> None:
    store[key] = (time.time(), value)


def _safe_float(value: Any) -> float | None:
    try:
        if value is None:
            return None
        return float(value)
    except (TypeError, ValueError):
        return None


def _resolve_dividend_yield(info: dict[str, Any], current_price: float | None) -> float | None:
    """Annual dividend yield as a decimal (e.g. 0.034 = 3.4%).

    Yahoo/yfinance fields are inconsistent: ``dividendYield`` is usually a decimal but can be
    wrong; ``trailingAnnualDividendYield`` is sometimes misparsed. Prefer computing from
    ``dividendRate`` (forward DPS) / price, then ``trailingAnnualDividendRate`` / price.
    """
    price = current_price
    if price is None or price <= 0:
        price = (
            _safe_float(info.get("regularMarketPrice"))
            or _safe_float(info.get("currentPrice"))
            or _safe_float(info.get("bid"))
        )
    if price and price > 0:
        for key in ("dividendRate", "trailingAnnualDividendRate"):
            dps = _safe_float(info.get(key))
            if dps is not None and dps > 0:
                y = dps / price
                if 0 < y <= 0.35:
                    return y

    raw = _safe_float(info.get("dividendYield"))
    if raw is None:
        raw = _safe_float(info.get("trailingAnnualDividendYield"))
    if raw is None:
        return None
    # Some responses use whole percent (e.g. 3.4) instead of 0.034
    if raw > 1:
        raw = raw / 100.0
    # Reject nonsense (often a dollar amount or bad scrape treated as yield)
    if raw < 0 or raw > 0.35:
        return None
    return raw


def _fx_rate(from_currency: str, to_currency: str) -> float | None:
    if not from_currency or not to_currency:
        return None
    base = from_currency.upper().strip()
    quote = to_currency.upper().strip()
    if base == quote:
        return 1.0
    # Yahoo FX pair format, e.g. TWDUSD=X
    pair = f"{base}{quote}=X"
    try:
        _throttle()
        history = yf.Ticker(pair).history(period="5d", interval="1d", auto_adjust=False)
    except Exception:
        return None
    if history is None or getattr(history, "empty", True):
        return None
    closes = history["Close"].dropna().tolist()
    if not closes:
        return None
    rate = _safe_float(closes[-1])
    if rate is None or rate <= 0:
        return None
    return rate


def _as_percent_string(value: float | None) -> str | None:
    if value is None:
        return None
    return f"{value * 100:.2f}%"


def _latest_statement_value(statement, candidates: list[str]) -> float | None:
    if statement is None or getattr(statement, "empty", True):
        return None
    latest_column = statement.columns[0]
    for candidate in candidates:
        if candidate in statement.index:
            return _safe_float(statement.loc[candidate, latest_column])
    return None


def _search_symbols(query: str) -> list[dict[str, str]]:
    cache_key = query.strip().lower()
    cached = _cache_get(_search_cache, cache_key, SEARCH_CACHE_TTL_SECONDS)
    if cached is not None:
        return cached

    _throttle()
    search = yf.Search(query=query, max_results=8)
    quotes = search.quotes or []
    results: list[dict[str, str]] = []
    for row in quotes:
        symbol = row.get("symbol")
        if not symbol:
            continue
        results.append(
            {
                "symbol": symbol,
                "name": row.get("shortname") or row.get("longname") or symbol,
                "region": row.get("exchange") or "N/A",
                "currency": row.get("currency") or "USD",
                "type": row.get("quoteType") or "EQUITY",
            }
        )
    _cache_set(_search_cache, cache_key, results)
    return results


def _read_json_response(raw: str) -> Any:
    try:
        return json.loads(raw) if raw else {}
    except json.JSONDecodeError:
        return {"message": raw or "Non-JSON response returned by AI API."}


def _extract_error_message(payload: Any) -> str:
    if isinstance(payload, list):
        return _extract_error_message(payload[0] if payload else {})

    if not isinstance(payload, dict):
        return ""

    error = payload.get("error")
    if isinstance(error, str):
        return error
    if isinstance(error, dict):
        message = error.get("message")
        if isinstance(message, str):
            return message

    message = payload.get("message")
    if isinstance(message, str):
        return message

    return ""


def _build_gemini_prompt(question: str, stock: dict[str, Any]) -> str:
    return (
        "You are a financial analysis assistant. Focus on interpretation and next-step judgment, not repeating "
        "raw values already shown in the UI. Only cite specific metrics when directly needed for the user's question.\n\n"
        "When analyzing a company, proactively combine fundamentals with recent company events (earnings, guidance, "
        "product launches, regulation, M&A, major contracts, management changes, legal issues, macro/commodity shocks) "
        "that could affect the outlook.\n\n"
        "Do not restate the full stock snapshot that the page already displays. If data is missing, say so "
        "briefly. You have access to Google Search tool. If the user asks about recent news, catalysts, or "
        "events, use search results first, summarize the key developments, and note uncertainty when sources "
        "conflict. If no relevant results are found, then say you cannot confirm recent events.\n\n"
        "End with a short disclaimer that this is not investment advice.\n\n"
        f"Loaded stock dataset:\n{json.dumps(stock, indent=2)}\n\n"
        f"Question: {question}"
    )


def _extract_gemini_text(payload: Any) -> str:
    if not isinstance(payload, dict):
        return "No answer returned."

    candidates = payload.get("candidates") or []
    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        content = candidate.get("content") or {}
        parts = content.get("parts") or []
        texts = [part.get("text", "") for part in parts if isinstance(part, dict) and part.get("text")]
        if texts:
            return "\n".join(texts).strip()

    prompt_feedback = payload.get("promptFeedback") or {}
    block_reason = prompt_feedback.get("blockReason")
    if block_reason:
        raise RuntimeError(f"Gemini blocked the response: {block_reason}")

    return "No answer returned."


def _request_gemini_with_sdk(model: str, prompt: str) -> str:
    if genai is None:
        raise RuntimeError("google-genai is not installed")

    client = genai.Client(api_key=SERVER_AI_API_KEY)
    config = None
    if hasattr(genai, "types"):
        config = genai.types.GenerateContentConfig(tools=[{"google_search": {}}])
    response = client.models.generate_content(model=model, contents=prompt, config=config)
    text = getattr(response, "text", None)
    if isinstance(text, str) and text.strip():
        return text.strip()

    response_dict = response.to_dict() if hasattr(response, "to_dict") else {}
    return _extract_gemini_text(response_dict)


def _request_gemini_with_rest(model: str, prompt: str) -> str:
    body = {
        "tools": [{"google_search": {}}],
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt,
                    }
                ]
            }
        ]
    }
    encoded_model = urllib.parse.quote(model, safe="-._")
    url = f"{GEMINI_API_BASE_URL}/models/{encoded_model}:generateContent"
    request_headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": SERVER_AI_API_KEY,
    }
    upstream_request = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers=request_headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(upstream_request, timeout=45) as response:
            payload = _read_json_response(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        error_payload = _read_json_response(exc.read().decode("utf-8", errors="replace"))
        message = _extract_error_message(error_payload) or f"Gemini API error ({exc.code})."
        raise RuntimeError(message) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Could not reach the Gemini API: {exc.reason}") from exc

    return _extract_gemini_text(payload)


def _request_ai_chat_completion(question: str, stock: dict[str, Any]) -> str:
    prompt = _build_gemini_prompt(question, stock)
    models_to_try: list[str] = []
    for model in [SERVER_AI_MODEL, *FALLBACK_AI_MODELS]:
        if model not in models_to_try:
            models_to_try.append(model)

    errors: list[str] = []
    for model in models_to_try:
        if genai is not None:
            try:
                return _request_gemini_with_sdk(model, prompt)
            except Exception as exc:
                errors.append(f"{model} (SDK): {str(exc).strip() or 'Unknown Gemini SDK error.'}")

        try:
            return _request_gemini_with_rest(model, prompt)
        except Exception as exc:
            errors.append(f"{model} (REST): {str(exc).strip() or 'Unknown Gemini REST error.'}")

    raise RuntimeError("All configured Gemini models failed: " + " | ".join(errors))


def _load_stock_snapshot(symbol: str) -> dict[str, Any]:
    cache_key = symbol.upper()
    cached = _cache_get(_cache, cache_key, CACHE_TTL_SECONDS)
    if cached is not None:
        return cached

    _throttle()
    ticker = yf.Ticker(cache_key)
    info = ticker.info or {}

    history = ticker.history(period="1y", interval="1d", auto_adjust=False)
    current_price = None
    previous_price = None
    price_history: list[dict[str, Any]] = []
    if history is not None and not history.empty:
        closes = history["Close"].dropna().tolist()
        if closes:
            current_price = _safe_float(closes[-1])
            if len(closes) > 1:
                previous_price = _safe_float(closes[-2])
        for index, close in history["Close"].dropna().items():
            close_value = _safe_float(close)
            if close_value is None:
                continue
            point_date = index.strftime("%Y-%m-%d") if hasattr(index, "strftime") else str(index)
            price_history.append({"date": point_date, "close": close_value})

    price_change = None
    price_change_percent = None
    if current_price is not None and previous_price:
        price_change = current_price - previous_price
        if previous_price:
            price_change_percent = _as_percent_string(price_change / previous_price)

    income_stmt = ticker.income_stmt
    balance_sheet = ticker.balance_sheet

    revenue = _safe_float(info.get("totalRevenue")) or _latest_statement_value(income_stmt, ["Total Revenue", "Operating Revenue"])
    net_income = _latest_statement_value(income_stmt, ["Net Income", "Net Income Common Stockholders"])
    operating_income = _latest_statement_value(income_stmt, ["Operating Income", "Total Operating Income As Reported"])
    gross_profit = _latest_statement_value(income_stmt, ["Gross Profit"])
    ebitda = _latest_statement_value(income_stmt, ["EBITDA"]) or _safe_float(info.get("ebitda"))

    total_assets = _latest_statement_value(balance_sheet, ["Total Assets"])
    total_liabilities = _latest_statement_value(balance_sheet, ["Total Liabilities Net Minority Interest"])
    total_equity = _latest_statement_value(balance_sheet, ["Stockholders Equity", "Total Equity Gross Minority Interest"])
    current_assets = _latest_statement_value(balance_sheet, ["Current Assets"])
    current_liabilities = _latest_statement_value(balance_sheet, ["Current Liabilities"])
    cash = _latest_statement_value(balance_sheet, ["Cash And Cash Equivalents", "Cash Cash Equivalents And Short Term Investments"])

    market_cap = _safe_float(info.get("marketCap"))
    pe_ratio = _safe_float(info.get("trailingPE"))
    eps = _safe_float(info.get("trailingEps"))
    dividend_yield = _resolve_dividend_yield(info, current_price)
    shares_outstanding = _safe_float(info.get("sharesOutstanding"))
    if market_cap is None and current_price is not None and shares_outstanding is not None:
        market_cap = current_price * shares_outstanding

    profit_margin = _safe_float(info.get("profitMargins"))
    if profit_margin is None and revenue and net_income:
        profit_margin = net_income / revenue
    operating_margin = _safe_float(info.get("operatingMargins"))
    if operating_margin is None and revenue and operating_income:
        operating_margin = operating_income / revenue
    gross_margin = _safe_float(info.get("grossMargins"))
    if gross_margin is None and revenue and gross_profit:
        gross_margin = gross_profit / revenue
    trading_currency = info.get("currency") or "USD"
    reporting_currency = info.get("financialCurrency") or trading_currency
    direct_price_to_sales = _safe_float(info.get("priceToSalesTrailing12Months"))
    price_to_sales = None
    if trading_currency == reporting_currency:
        if direct_price_to_sales is not None:
            price_to_sales = direct_price_to_sales
        elif market_cap and revenue:
            price_to_sales = market_cap / revenue
    elif market_cap and revenue:
        # Cross-currency listing (e.g. ADR): convert statement currency before deriving P/S.
        fx = _fx_rate(reporting_currency, trading_currency)
        if fx is not None:
            revenue_in_trading_currency = revenue * fx
            if revenue_in_trading_currency > 0:
                price_to_sales = market_cap / revenue_in_trading_currency

    return_on_assets = _safe_float(info.get("returnOnAssets"))
    if return_on_assets is None and total_assets and net_income:
        return_on_assets = net_income / total_assets
    return_on_equity = _safe_float(info.get("returnOnEquity"))
    if return_on_equity is None and total_equity and net_income:
        return_on_equity = net_income / total_equity
    current_ratio = _safe_float(info.get("currentRatio"))
    if current_ratio is None and current_assets and current_liabilities:
        current_ratio = current_assets / current_liabilities
    debt_to_equity = _safe_float(info.get("debtToEquity"))
    if debt_to_equity is not None:
        debt_to_equity = debt_to_equity / 100
    elif total_equity and total_liabilities:
        debt_to_equity = total_liabilities / total_equity
    cash_ratio = None
    if cash and current_liabilities:
        cash_ratio = cash / current_liabilities

    payload: dict[str, Any] = {
        "symbol": cache_key,
        "companyName": info.get("shortName") or info.get("longName") or cache_key,
        "description": info.get("longBusinessSummary"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "exchange": info.get("exchange"),
        "currency": trading_currency,
        "reportingCurrency": reporting_currency,
        "price": current_price,
        "priceChange": price_change,
        "priceChangePercent": price_change_percent,
        "priceHistory": price_history[-120:],
        "marketCap": market_cap,
        "peRatio": pe_ratio,
        "eps": eps,
        "forwardDividendYield": dividend_yield,
        "dividendYield": dividend_yield,
        "profitMargin": profit_margin,
        "operatingMargin": operating_margin,
        "grossMargin": gross_margin,
        "priceToSales": price_to_sales,
        "returnOnAssets": return_on_assets,
        "returnOnEquity": return_on_equity,
        "currentRatio": current_ratio,
        "debtToEquity": debt_to_equity,
        "cashRatio": cash_ratio,
        "revenue": revenue,
        "netIncome": net_income,
        "operatingIncome": operating_income,
        "grossProfit": gross_profit,
        "ebitda": ebitda,
        "totalAssets": total_assets,
        "totalLiabilities": total_liabilities,
        "totalEquity": total_equity,
        "currentAssets": current_assets,
        "currentLiabilities": current_liabilities,
        "cash": cash,
        "fiscalDateEnding": info.get("lastFiscalYearEnd"),
    }
    _cache_set(_cache, cache_key, payload)
    return payload


@app.get("/api/search")
def api_search():
    query = (request.args.get("query") or "").strip()
    if len(query) < 2:
        return jsonify({"matches": []})
    try:
        return jsonify({"matches": _search_symbols(query)})
    except Exception as exc:  # pragma: no cover - safety net
        return jsonify({"error": f"Search failed: {exc}"}), 502


@app.get("/api/stock")
def api_stock():
    symbol = (request.args.get("symbol") or "").strip().upper()
    if not symbol:
        return jsonify({"error": "Missing symbol parameter"}), 400
    try:
        data = _load_stock_snapshot(symbol)
        return jsonify({"stock": data})
    except Exception as exc:  # pragma: no cover - safety net
        return jsonify({"error": f"Stock lookup failed: {exc}"}), 502


@app.post("/api/chat")
def api_chat():
    if not SERVER_AI_API_KEY:
        return (
            jsonify(
                {
                    "error": (
                        "Server Gemini key is not configured. Set GEMINI_API_KEY or GOOGLE_API_KEY "
                        "before starting the backend."
                    )
                }
            ),
            503,
        )

    payload = request.get_json(silent=True) or {}
    question = (payload.get("question") or "").strip()
    stock = payload.get("stock")

    if not question:
        return jsonify({"error": "Missing question"}), 400
    if not isinstance(stock, dict):
        return jsonify({"error": "Missing stock payload"}), 400

    try:
        answer = _request_ai_chat_completion(question, stock)
        return jsonify({"answer": answer, "model": SERVER_AI_MODEL})
    except Exception as exc:  # pragma: no cover - safety net
        return jsonify({"error": f"AI request failed: {exc}"}), 502


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:path>")
def static_files(path: str):
    full_path = BASE_DIR / path
    if not full_path.exists():
        if Path(path).suffix:
            return "Not found", 404
        return send_from_directory(BASE_DIR, "index.html")
    return send_from_directory(BASE_DIR, path)


if __name__ == "__main__":
    if not INDEX_FILE.exists():
        raise RuntimeError("index.html not found at project root")
    app.run(host="0.0.0.0", port=4173, debug=True)
