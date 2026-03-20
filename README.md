# StockScope AI

A single-page stock research dashboard that pulls **real stock market and accounting data** from Alpha Vantage and offers an **AI chatbot** for follow-up analysis using an OpenAI-compatible API.

## Features

- Search by ticker to load live quote + company overview data.
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
- Settings dialog lets you save your Alpha Vantage key and AI API configuration in browser local storage.

## Running locally

Because this is a static site, you can serve it with any local web server.

### Option 1: Python

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

### Option 2: VS Code Live Server

Open the repository in VS Code and run Live Server on `index.html`.

## API setup

### Stock data

1. Get an Alpha Vantage API key: https://www.alphavantage.co/support/#api-key
2. Open **API settings** in the app.
3. Paste the API key.

> The app defaults to Alpha Vantage's `demo` key, which is rate-limited and only reliably supports sample symbols.

### AI chatbot

1. Use an OpenAI-compatible API endpoint.
2. In **API settings**, set:
   - AI base URL
   - AI API key
   - AI model name
3. Ask a question after loading a stock.

## Notes

- This project is for educational use and is **not investment advice**.
- Statement availability depends on the coverage returned by Alpha Vantage.
- Some tickers may hit API rate limits when using the demo key.
