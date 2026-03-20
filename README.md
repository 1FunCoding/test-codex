# StockScope AI

A stock research dashboard with a Python backend using **yfinance** for market/fundamental data and a frontend AI chatbot backed by the native Gemini API.

## Features

- Search by ticker or company name to find and load stocks.
- Pulls fundamental statement data such as revenue, net income, assets, liabilities, and equity.
- Computes useful accounting ratios:
  - P/E ratio
  - Price-to-sales
  - Gross margin
  - Operating margin
  - Profit margin
  - Return on assets
  - Return on equity
  - Current ratio
  - Debt-to-equity
  - Cash ratio
- Includes an AI chatbot panel that uses the loaded stock dataset as context for answering stock-analysis questions.
- Includes beginner-friendly good-signal/risk-signal cards.
- Keeps the Gemini API key on the backend instead of in the browser.

## Running locally

## 1) Create a virtual environment (recommended)

```bash
cd /Users/wangqi/test-codex
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

## 2) Start the app (backend + frontend on one port)

```bash
export GEMINI_API_KEY="your-key-here"
npm start
```

Then open `http://localhost:4173`.

## API setup

### Stock data

- No Alpha Vantage key is needed now.
- Stock lookup/search is provided by the backend (`/api/search` and `/api/stock`) using yfinance.

### AI chatbot

- Set `GEMINI_API_KEY` before starting the backend.
- Optional: set `GEMINI_MODEL` if you want to override the default `gemini-2.5-flash`.
- The frontend sends chat requests only to `/api/chat`; the browser never sends the Gemini key to Google directly.
- The backend prefers the official Python Gemini SDK (`google-genai`) and falls back to the native Gemini REST API if the SDK is unavailable.

## Notes

- This project is for educational use and is **not investment advice**.
- yfinance coverage varies by symbol/market and some fields can be missing.
- If running from Anaconda and you see dependency conflicts, prefer using `.venv` for isolation.
