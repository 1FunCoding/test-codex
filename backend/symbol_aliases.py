from __future__ import annotations

from typing import Any


BASE_MIN_SEARCH_LENGTH = 3
CJK_MIN_SEARCH_LENGTH = 2


SYMBOL_ALIAS_CATALOG: list[dict[str, Any]] = [
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["苹果", "苹果公司", "apple"],
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["微软", "微软公司", "microsoft"],
    },
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["英伟达", "英偉達", "辉达", "輝達", "nvidia"],
    },
    {
        "symbol": "GOOGL",
        "name": "Alphabet Inc.",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["谷歌", "google", "alphabet"],
    },
    {
        "symbol": "AMZN",
        "name": "Amazon.com, Inc.",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["亚马逊", "亞馬遜", "amazon"],
    },
    {
        "symbol": "META",
        "name": "Meta Platforms, Inc.",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["脸书", "臉書", "facebook", "meta"],
    },
    {
        "symbol": "TSLA",
        "name": "Tesla, Inc.",
        "region": "NASDAQ",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["特斯拉", "tesla"],
    },
    {
        "symbol": "CVX",
        "name": "Chevron Corporation",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["雪佛龙", "雪佛龍", "雪佛龙公司", "chevron"],
    },
    {
        "symbol": "XOM",
        "name": "Exxon Mobil Corporation",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["埃克森美孚", "艾克森美孚", "exxon", "exxon mobil"],
    },
    {
        "symbol": "HSBC",
        "name": "HSBC Holdings plc",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["汇丰", "滙豐", "汇丰控股", "滙豐控股", "hsbc", "hsbc holdings"],
    },
    {
        "symbol": "JPM",
        "name": "JPMorgan Chase & Co.",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["摩根大通", "小摩", "jpmorgan", "jp morgan"],
    },
    {
        "symbol": "BAC",
        "name": "Bank of America Corporation",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["美国银行", "美银", "美銀", "bank of america"],
    },
    {
        "symbol": "WFC",
        "name": "Wells Fargo & Company",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["富国银行", "富國銀行", "wells fargo"],
    },
    {
        "symbol": "BRK-B",
        "name": "Berkshire Hathaway Inc.",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["伯克希尔", "伯克希尔哈撒韦", "波克夏", "berkshire", "berkshire hathaway"],
    },
    {
        "symbol": "DIS",
        "name": "The Walt Disney Company",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["迪士尼", "disney"],
    },
    {
        "symbol": "NKE",
        "name": "NIKE, Inc.",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["耐克", "nike"],
    },
    {
        "symbol": "BABA",
        "name": "Alibaba Group Holding Limited",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["阿里巴巴", "阿里", "alibaba"],
    },
    {
        "symbol": "9988.HK",
        "name": "Alibaba Group Holding Limited",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["阿里巴巴港股", "阿里港股", "9988", "alibaba hk"],
    },
    {
        "symbol": "TSM",
        "name": "Taiwan Semiconductor Manufacturing Company Limited",
        "region": "NYSE",
        "currency": "USD",
        "type": "EQUITY",
        "aliases": ["台积电", "台積電", "台积", "台積", "tsmc"],
    },
    {
        "symbol": "2330.TW",
        "name": "Taiwan Semiconductor Manufacturing Company Limited",
        "region": "TWSE",
        "currency": "TWD",
        "type": "EQUITY",
        "aliases": ["台积电台股", "台積電台股", "台积电台湾", "台積電台灣", "tsmc tw"],
    },
    {
        "symbol": "0700.HK",
        "name": "Tencent Holdings Limited",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["腾讯", "騰訊", "腾讯控股", "騰訊控股", "tencent"],
    },
    {
        "symbol": "0005.HK",
        "name": "HSBC Holdings plc",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["汇丰港股", "滙豐港股", "汇丰香港", "滙豐香港", "0005"],
    },
    {
        "symbol": "1211.HK",
        "name": "BYD Company Limited",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["比亚迪", "比亞迪", "byd", "比亚迪港股", "比亞迪港股"],
    },
    {
        "symbol": "1810.HK",
        "name": "Xiaomi Corporation",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["小米", "小米集团", "小米集團", "xiaomi"],
    },
    {
        "symbol": "3690.HK",
        "name": "Meituan",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["美团", "美團", "meituan"],
    },
    {
        "symbol": "9618.HK",
        "name": "JD.com, Inc.",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["京东", "京東", "京东集团", "京東集團", "jd", "jdcom"],
    },
    {
        "symbol": "9888.HK",
        "name": "Baidu, Inc.",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["百度港股", "百度集团", "百度集團", "baidu hk"],
    },
    {
        "symbol": "9999.HK",
        "name": "NetEase, Inc.",
        "region": "HKEX",
        "currency": "HKD",
        "type": "EQUITY",
        "aliases": ["网易", "網易", "网易港股", "網易港股", "netease hk"],
    },
    {
        "symbol": "7203.T",
        "name": "Toyota Motor Corporation",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["丰田", "豐田", "丰田汽车", "豐田汽車", "toyota"],
    },
    {
        "symbol": "6758.T",
        "name": "Sony Group Corporation",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["索尼", "sony"],
    },
    {
        "symbol": "7974.T",
        "name": "Nintendo Co., Ltd.",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["任天堂", "nintendo"],
    },
    {
        "symbol": "9984.T",
        "name": "SoftBank Group Corp.",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["软银", "軟銀", "软银集团", "軟銀集團", "softbank"],
    },
    {
        "symbol": "9983.T",
        "name": "Fast Retailing Co., Ltd.",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["优衣库", "優衣庫", "迅销", "迅銷", "fast retailing", "uniqlo"],
    },
    {
        "symbol": "6861.T",
        "name": "Keyence Corporation",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["基恩士", "keyence"],
    },
    {
        "symbol": "6501.T",
        "name": "Hitachi, Ltd.",
        "region": "TSE",
        "currency": "JPY",
        "type": "EQUITY",
        "aliases": ["日立", "hitachi"],
    },
    {
        "symbol": "005930.KS",
        "name": "Samsung Electronics Co., Ltd.",
        "region": "KRX",
        "currency": "KRW",
        "type": "EQUITY",
        "aliases": ["三星", "三星电子", "三星電子", "samsung", "samsung electronics"],
    },
    {
        "symbol": "000660.KS",
        "name": "SK hynix Inc.",
        "region": "KRX",
        "currency": "KRW",
        "type": "EQUITY",
        "aliases": ["sk海力士", "海力士", "sk hynix", "hynix"],
    },
    {
        "symbol": "005380.KS",
        "name": "Hyundai Motor Company",
        "region": "KRX",
        "currency": "KRW",
        "type": "EQUITY",
        "aliases": ["现代汽车", "現代汽車", "现代", "現代", "hyundai"],
    },
    {
        "symbol": "035420.KS",
        "name": "NAVER Corporation",
        "region": "KRX",
        "currency": "KRW",
        "type": "EQUITY",
        "aliases": ["naver", "韩国谷歌", "韓國谷歌", "韩国搜索"],
    },
    {
        "symbol": "MC.PA",
        "name": "LVMH Moet Hennessy Louis Vuitton SE",
        "region": "Euronext Paris",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["lvmh", "路威酩轩", "路威酩軒", "lvmh集团", "lvmh 集团"],
    },
    {
        "symbol": "RMS.PA",
        "name": "Hermes International SCA",
        "region": "Euronext Paris",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["爱马仕", "愛馬仕", "hermes"],
    },
    {
        "symbol": "OR.PA",
        "name": "L'Oreal S.A.",
        "region": "Euronext Paris",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["欧莱雅", "歐萊雅", "loreal", "欧莱雅集团", "歐萊雅集團"],
    },
    {
        "symbol": "AIR.PA",
        "name": "Airbus SE",
        "region": "Euronext Paris",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["空客", "airbus"],
    },
    {
        "symbol": "ASML.AS",
        "name": "ASML Holding N.V.",
        "region": "Euronext Amsterdam",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["阿斯麦", "阿斯麥", "asml"],
    },
    {
        "symbol": "SAP.DE",
        "name": "SAP SE",
        "region": "Xetra",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["sap", "思爱普", "思愛普"],
    },
    {
        "symbol": "SIE.DE",
        "name": "Siemens AG",
        "region": "Xetra",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["西门子", "西門子", "siemens"],
    },
    {
        "symbol": "VOW3.DE",
        "name": "Volkswagen AG",
        "region": "Xetra",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["大众", "大眾", "大众汽车", "大眾汽車", "volkswagen", "vw"],
    },
    {
        "symbol": "BMW.DE",
        "name": "Bayerische Motoren Werke AG",
        "region": "Xetra",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["宝马", "寶馬", "bmw"],
    },
    {
        "symbol": "MBG.DE",
        "name": "Mercedes-Benz Group AG",
        "region": "Xetra",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["梅赛德斯", "梅賽德斯", "奔驰", "賓士", "mercedes", "mercedes benz"],
    },
    {
        "symbol": "NESN.SW",
        "name": "Nestle S.A.",
        "region": "SIX",
        "currency": "CHF",
        "type": "EQUITY",
        "aliases": ["雀巢", "nestle"],
    },
    {
        "symbol": "ROG.SW",
        "name": "Roche Holding AG",
        "region": "SIX",
        "currency": "CHF",
        "type": "EQUITY",
        "aliases": ["罗氏", "羅氏", "roche"],
    },
    {
        "symbol": "NOVN.SW",
        "name": "Novartis AG",
        "region": "SIX",
        "currency": "CHF",
        "type": "EQUITY",
        "aliases": ["诺华", "諾華", "novartis"],
    },
    {
        "symbol": "NOVO-B.CO",
        "name": "Novo Nordisk A/S",
        "region": "Nasdaq Copenhagen",
        "currency": "DKK",
        "type": "EQUITY",
        "aliases": ["诺和诺德", "諾和諾德", "novo nordisk"],
    },
    {
        "symbol": "SHEL.L",
        "name": "Shell plc",
        "region": "LSE",
        "currency": "GBP",
        "type": "EQUITY",
        "aliases": ["壳牌", "殼牌", "shell"],
    },
    {
        "symbol": "ULVR.L",
        "name": "Unilever PLC",
        "region": "LSE",
        "currency": "GBP",
        "type": "EQUITY",
        "aliases": ["联合利华", "聯合利華", "unilever"],
    },
    {
        "symbol": "RACE.MI",
        "name": "Ferrari N.V.",
        "region": "Borsa Italiana",
        "currency": "EUR",
        "type": "EQUITY",
        "aliases": ["法拉利", "ferrari"],
    },
    {
        "symbol": "RELIANCE.NS",
        "name": "Reliance Industries Limited",
        "region": "NSE",
        "currency": "INR",
        "type": "EQUITY",
        "aliases": ["信实工业", "信實工業", "reliance", "reliance industries"],
    },
    {
        "symbol": "TCS.NS",
        "name": "Tata Consultancy Services Limited",
        "region": "NSE",
        "currency": "INR",
        "type": "EQUITY",
        "aliases": ["塔塔咨询", "塔塔諮詢", "塔塔咨询服务", "塔塔諮詢服務", "tcs", "tata consultancy services"],
    },
    {
        "symbol": "INFY.NS",
        "name": "Infosys Limited",
        "region": "NSE",
        "currency": "INR",
        "type": "EQUITY",
        "aliases": ["印孚瑟斯", "infosys"],
    },
    {
        "symbol": "HDFCBANK.NS",
        "name": "HDFC Bank Limited",
        "region": "NSE",
        "currency": "INR",
        "type": "EQUITY",
        "aliases": ["hdfc银行", "hdfc 銀行", "hdfc bank"],
    },
    {
        "symbol": "PETR4.SA",
        "name": "Petroleo Brasileiro S.A. - Petrobras",
        "region": "B3",
        "currency": "BRL",
        "type": "EQUITY",
        "aliases": ["巴西石油", "petrobras"],
    },
    {
        "symbol": "VALE3.SA",
        "name": "Vale S.A.",
        "region": "B3",
        "currency": "BRL",
        "type": "EQUITY",
        "aliases": ["淡水河谷", "vale"],
    },
]


def _is_cjk_char(char: str) -> bool:
    return (
        "\u3400" <= char <= "\u4dbf"
        or "\u4e00" <= char <= "\u9fff"
        or "\uf900" <= char <= "\ufaff"
    )


def contains_cjk(value: str) -> bool:
    return any(_is_cjk_char(char) for char in str(value or ""))


def minimum_search_length(query: str) -> int:
    return CJK_MIN_SEARCH_LENGTH if contains_cjk(query) else BASE_MIN_SEARCH_LENGTH


def normalize_alias_token(value: str) -> str:
    normalized_chars: list[str] = []
    for char in str(value or "").strip().casefold():
        if char.isalnum() or _is_cjk_char(char):
            normalized_chars.append(char)
    return "".join(normalized_chars)


def _build_catalog_index() -> tuple[list[dict[str, Any]], dict[str, str]]:
    indexed_entries: list[dict[str, Any]] = []
    alias_to_symbol: dict[str, str] = {}

    for raw_entry in SYMBOL_ALIAS_CATALOG:
        entry = dict(raw_entry)
        tokens = {
            normalize_alias_token(entry.get("symbol", "")),
            normalize_alias_token(entry.get("name", "")),
        }
        for alias in entry.get("aliases", []):
            tokens.add(normalize_alias_token(alias))
        search_tokens = sorted(token for token in tokens if token)
        entry["_search_tokens"] = search_tokens
        indexed_entries.append(entry)
        for token in search_tokens:
            alias_to_symbol.setdefault(token, entry["symbol"])

    return indexed_entries, alias_to_symbol


_INDEXED_CATALOG, _ALIAS_TO_SYMBOL = _build_catalog_index()


def resolve_symbol_alias(value: str) -> str:
    normalized = normalize_alias_token(value)
    if normalized in _ALIAS_TO_SYMBOL:
        return _ALIAS_TO_SYMBOL[normalized]
    return str(value or "").strip().upper()


def alias_search_matches(query: str, limit: int = 8) -> list[dict[str, str]]:
    normalized_query = normalize_alias_token(query)
    if not normalized_query:
        return []

    scored_matches: list[tuple[int, dict[str, Any]]] = []
    for entry in _INDEXED_CATALOG:
        tokens = entry["_search_tokens"]
        score = 0
        if normalized_query == normalize_alias_token(entry["symbol"]):
            score = 160
        elif normalized_query in tokens:
            score = 140
        elif any(token.startswith(normalized_query) for token in tokens):
            score = 110
        elif any(normalized_query in token for token in tokens):
            score = 80

        if score <= 0:
            continue

        scored_matches.append((score, entry))

    scored_matches.sort(key=lambda row: (-row[0], row[1]["symbol"]))
    results: list[dict[str, str]] = []
    for _, entry in scored_matches[:limit]:
        results.append(
            {
                "symbol": entry["symbol"],
                "name": entry["name"],
                "region": entry.get("region") or "N/A",
                "currency": entry.get("currency") or "USD",
                "type": entry.get("type") or "EQUITY",
            }
        )
    return results
