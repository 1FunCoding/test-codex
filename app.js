const DEFAULTS = {
  stockApiKey: 'demo',
  aiBaseUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-4o-mini',
};

const state = {
  stock: null,
  settings: loadSettings(),
};

const elements = {
  stockForm: document.querySelector('#stock-form'),
  tickerInput: document.querySelector('#ticker-input'),
  status: document.querySelector('#status'),
  companyName: document.querySelector('#company-name'),
  companySummary: document.querySelector('#company-summary'),
  priceBadge: document.querySelector('#price-badge'),
  heroStats: document.querySelector('#hero-stats'),
  metricsGrid: document.querySelector('#metrics-grid'),
  incomeList: document.querySelector('#income-list'),
  balanceList: document.querySelector('#balance-list'),
  narrative: document.querySelector('#narrative'),
  chatLog: document.querySelector('#chat-log'),
  chatForm: document.querySelector('#chat-form'),
  chatInput: document.querySelector('#chat-input'),
  settingsDialog: document.querySelector('#settings-dialog'),
  openSettings: document.querySelector('#open-settings'),
  saveSettings: document.querySelector('#save-settings'),
  stockApiKey: document.querySelector('#stock-api-key'),
  aiBaseUrl: document.querySelector('#ai-base-url'),
  aiApiKey: document.querySelector('#ai-api-key'),
  aiModel: document.querySelector('#ai-model'),
  quickPicks: document.querySelectorAll('.chip'),
};

initialize();

function initialize() {
  hydrateSettingsForm();
  elements.openSettings.addEventListener('click', () => elements.settingsDialog.showModal());
  elements.saveSettings.addEventListener('click', saveSettings);
  elements.stockForm.addEventListener('submit', handleStockLookup);
  elements.chatForm.addEventListener('submit', handleChatSubmit);
  elements.quickPicks.forEach((chip) => {
    chip.addEventListener('click', () => {
      elements.tickerInput.value = chip.dataset.symbol;
      elements.stockForm.requestSubmit();
    });
  });
  renderMetrics([]);
}

function loadSettings() {
  const stored = JSON.parse(localStorage.getItem('stockscope-settings') || '{}');
  return {
    stockApiKey: stored.stockApiKey || DEFAULTS.stockApiKey,
    aiBaseUrl: stored.aiBaseUrl || DEFAULTS.aiBaseUrl,
    aiApiKey: stored.aiApiKey || '',
    aiModel: stored.aiModel || DEFAULTS.aiModel,
  };
}

function hydrateSettingsForm() {
  elements.stockApiKey.value = state.settings.stockApiKey;
  elements.aiBaseUrl.value = state.settings.aiBaseUrl;
  elements.aiApiKey.value = state.settings.aiApiKey;
  elements.aiModel.value = state.settings.aiModel;
}

function saveSettings() {
  state.settings = {
    stockApiKey: elements.stockApiKey.value.trim() || DEFAULTS.stockApiKey,
    aiBaseUrl: elements.aiBaseUrl.value.trim() || DEFAULTS.aiBaseUrl,
    aiApiKey: elements.aiApiKey.value.trim(),
    aiModel: elements.aiModel.value.trim() || DEFAULTS.aiModel,
  };
  localStorage.setItem('stockscope-settings', JSON.stringify(state.settings));
  setStatus(`Settings saved. Stock API key: ${state.settings.stockApiKey === 'demo' ? 'demo' : 'custom'}.`);
}

async function handleStockLookup(event) {
  event.preventDefault();
  const ticker = elements.tickerInput.value.trim().toUpperCase();
  if (!ticker) return;

  setStatus(`Loading live data for ${ticker}...`);

  try {
    const [overview, quote, income, balance] = await Promise.all([
      fetchAlphaVantage('OVERVIEW', ticker),
      fetchAlphaVantage('GLOBAL_QUOTE', ticker),
      fetchAlphaVantage('INCOME_STATEMENT', ticker),
      fetchAlphaVantage('BALANCE_SHEET', ticker),
    ]);

    if (!overview?.Symbol || !quote?.['Global Quote']?.['01. symbol']) {
      throw new Error('No stock data returned. Check the ticker symbol or your API key.');
    }

    const normalized = normalizeStockData(overview, quote['Global Quote'], income, balance);
    state.stock = normalized;
    renderStock(normalized);
    addMessage('assistant', `Loaded ${normalized.companyName} (${normalized.symbol}). Ask me about valuation, margins, leverage, or risks.`);
    setStatus(`Loaded real-time stock data for ${normalized.symbol}.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
}

async function fetchAlphaVantage(fn, symbol) {
  const params = new URLSearchParams({
    function: fn,
    symbol,
    apikey: state.settings.stockApiKey,
  });

  const response = await fetch(`https://www.alphavantage.co/query?${params.toString()}`);
  const payload = await response.json();

  if (payload.Note) {
    throw new Error('Alpha Vantage rate limit hit. Wait a moment or use your own API key in Settings.');
  }

  if (payload.Information) {
    throw new Error(payload.Information);
  }

  return payload;
}

function normalizeStockData(overview, quote, income, balance) {
  const annualIncome = income.annualReports?.[0] || {};
  const annualBalance = balance.annualReports?.[0] || {};

  const price = numberFrom(quote['05. price']);
  const sharesOutstanding = numberFrom(overview.SharesOutstanding);
  const revenue = numberFrom(annualIncome.totalRevenue || overview.RevenueTTM);
  const reportedProfitMargin = numberFrom(overview.ProfitMargin);
  const netIncome = numberFrom(annualIncome.netIncome) ?? (reportedProfitMargin != null && revenue ? reportedProfitMargin * revenue : null);
  const operatingIncome = numberFrom(annualIncome.operatingIncome);
  const grossProfit = numberFrom(annualIncome.grossProfit);
  const ebitda = numberFrom(overview.EBITDA);
  const totalAssets = numberFrom(annualBalance.totalAssets);
  const totalLiabilities = numberFrom(annualBalance.totalLiabilities);
  const totalEquity = numberFrom(annualBalance.totalShareholderEquity);
  const currentAssets = numberFrom(annualBalance.totalCurrentAssets);
  const currentLiabilities = numberFrom(annualBalance.totalCurrentLiabilities);
  const cash = numberFrom(annualBalance.cashAndCashEquivalentsAtCarryingValue);

  const marketCap = numberFrom(overview.MarketCapitalization) || price * sharesOutstanding;
  const peRatio = numberFrom(overview.PERatio);
  const eps = numberFrom(overview.EPS);
  const profitMargin = reportedProfitMargin ?? (revenue && netIncome ? netIncome / revenue : null);
  const operatingMargin = revenue ? operatingIncome / revenue : numberFrom(overview.OperatingMarginTTM);
  const grossMargin = revenue ? grossProfit / revenue : null;
  const priceToSales = revenue ? marketCap / revenue : null;
  const returnOnAssets = totalAssets ? netIncome / totalAssets : null;
  const returnOnEquity = totalEquity ? netIncome / totalEquity : null;
  const currentRatio = currentLiabilities ? currentAssets / currentLiabilities : null;
  const debtToEquity = totalEquity ? totalLiabilities / totalEquity : null;
  const cashRatio = currentLiabilities ? cash / currentLiabilities : null;

  return {
    symbol: overview.Symbol,
    companyName: overview.Name,
    description: overview.Description,
    sector: overview.Sector,
    industry: overview.Industry,
    exchange: overview.Exchange,
    currency: overview.Currency,
    price,
    priceChange: numberFrom(quote['09. change']),
    priceChangePercent: quote['10. change percent'],
    marketCap,
    peRatio,
    eps,
    dividendYield: numberFrom(overview.DividendYield),
    profitMargin,
    operatingMargin,
    grossMargin,
    priceToSales,
    returnOnAssets,
    returnOnEquity,
    currentRatio,
    debtToEquity,
    cashRatio,
    revenue,
    netIncome,
    operatingIncome,
    grossProfit,
    ebitda,
    totalAssets,
    totalLiabilities,
    totalEquity,
    currentAssets,
    currentLiabilities,
    cash,
    fiscalDateEnding: annualIncome.fiscalDateEnding || annualBalance.fiscalDateEnding || overview.LatestQuarter,
  };
}

function renderStock(stock) {
  elements.companyName.textContent = `${stock.companyName} (${stock.symbol})`;
  elements.companySummary.textContent = `${stock.sector || 'N/A'} • ${stock.industry || 'N/A'} • ${stock.exchange || 'N/A'} • Latest annual period: ${stock.fiscalDateEnding || 'N/A'}`;
  elements.priceBadge.classList.remove('muted');
  elements.priceBadge.innerHTML = `${formatCurrency(stock.price, stock.currency)}<small>${formatSigned(stock.priceChange)} (${stock.priceChangePercent || 'n/a'})</small>`;

  const heroStats = [
    ['Market cap', formatCompactCurrency(stock.marketCap, stock.currency)],
    ['P/E ratio', formatNumber(stock.peRatio)],
    ['EPS', formatCurrency(stock.eps, stock.currency)],
    ['Profit margin', formatPercent(stock.profitMargin)],
  ];
  elements.heroStats.innerHTML = heroStats.map(cardTemplate).join('');

  const metricCards = [
    ['Revenue', formatCompactCurrency(stock.revenue, stock.currency)],
    ['Net income', formatCompactCurrency(stock.netIncome, stock.currency)],
    ['Operating margin', formatPercent(stock.operatingMargin)],
    ['Gross margin', formatPercent(stock.grossMargin)],
    ['Price / sales', formatNumber(stock.priceToSales)],
    ['Return on assets', formatPercent(stock.returnOnAssets)],
    ['Return on equity', formatPercent(stock.returnOnEquity)],
    ['Current ratio', formatNumber(stock.currentRatio)],
    ['Debt / equity', formatNumber(stock.debtToEquity)],
    ['Cash ratio', formatNumber(stock.cashRatio)],
    ['EBITDA', formatCompactCurrency(stock.ebitda, stock.currency)],
    ['Dividend yield', formatPercent(stock.dividendYield)],
  ];
  renderMetrics(metricCards);

  renderDataList(elements.incomeList, [
    ['Revenue', formatCompactCurrency(stock.revenue, stock.currency)],
    ['Gross profit', formatCompactCurrency(stock.grossProfit, stock.currency)],
    ['Operating income', formatCompactCurrency(stock.operatingIncome, stock.currency)],
    ['Net income', formatCompactCurrency(stock.netIncome, stock.currency)],
    ['EBITDA', formatCompactCurrency(stock.ebitda, stock.currency)],
  ]);

  renderDataList(elements.balanceList, [
    ['Total assets', formatCompactCurrency(stock.totalAssets, stock.currency)],
    ['Total liabilities', formatCompactCurrency(stock.totalLiabilities, stock.currency)],
    ['Shareholder equity', formatCompactCurrency(stock.totalEquity, stock.currency)],
    ['Current assets', formatCompactCurrency(stock.currentAssets, stock.currency)],
    ['Current liabilities', formatCompactCurrency(stock.currentLiabilities, stock.currency)],
    ['Cash & equivalents', formatCompactCurrency(stock.cash, stock.currency)],
  ]);

  elements.narrative.textContent = buildNarrative(stock);
}

function renderMetrics(metrics) {
  elements.metricsGrid.innerHTML = metrics.length
    ? metrics.map(([label, value]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`).join('')
    : '<article class="metric-card"><span>Awaiting data</span><strong>Load a ticker</strong></article>';
}

function renderDataList(target, items) {
  target.innerHTML = items.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('');
}

function buildNarrative(stock) {
  const valuation = stock.peRatio
    ? `The stock trades at about ${formatNumber(stock.peRatio)}x earnings and ${formatNumber(stock.priceToSales)}x sales.`
    : 'The valuation snapshot is incomplete because earnings-based ratios are unavailable.';
  const profitability = `Profitability shows ${formatPercent(stock.profitMargin)} net margin and ${formatPercent(stock.operatingMargin)} operating margin on ${formatCompactCurrency(stock.revenue, stock.currency)} of revenue.`;
  const balanceSheet = `The balance sheet reports ${formatCompactCurrency(stock.totalAssets, stock.currency)} in assets, ${formatCompactCurrency(stock.totalLiabilities, stock.currency)} in liabilities, a current ratio of ${formatNumber(stock.currentRatio)}, and debt/equity of ${formatNumber(stock.debtToEquity)}.`;
  const returns = `Capital efficiency is summarized by ROA of ${formatPercent(stock.returnOnAssets)} and ROE of ${formatPercent(stock.returnOnEquity)}.`;
  return `${valuation} ${profitability} ${balanceSheet} ${returns}`;
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const question = elements.chatInput.value.trim();
  if (!question) return;
  if (!state.stock) {
    setStatus('Load a stock before using the AI chatbot.', true);
    return;
  }

  addMessage('user', question);
  elements.chatInput.value = '';

  if (!state.settings.aiApiKey) {
    addMessage(
      'assistant',
      'Add an AI API key in Settings to enable live chatbot responses. I already generated the stock narrative above from the loaded market data.'
    );
    return;
  }

  addMessage('assistant', 'Analyzing the stock data...');

  try {
    const answer = await fetchAiAnalysis(question, state.stock);
    replaceLastAssistantMessage(answer);
  } catch (error) {
    console.error(error);
    replaceLastAssistantMessage(`AI request failed: ${error.message}`);
  }
}

async function fetchAiAnalysis(question, stock) {
  const response = await fetch(`${state.settings.aiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.settings.aiApiKey}`,
    },
    body: JSON.stringify({
      model: state.settings.aiModel,
      messages: [
        {
          role: 'system',
          content:
            'You are a financial analysis assistant. Use the provided stock metrics to explain valuation, accounting ratios, profitability, leverage, and risks. Be clear that this is not investment advice.',
        },
        {
          role: 'user',
          content: `Here is the loaded stock dataset:\n${JSON.stringify(stock, null, 2)}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.4,
    }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || 'Unexpected AI API error');
  }
  return payload.choices?.[0]?.message?.content?.trim() || 'No answer returned.';
}

function addMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.textContent = text;
  elements.chatLog.appendChild(message);
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function replaceLastAssistantMessage(text) {
  const messages = [...elements.chatLog.querySelectorAll('.message.assistant')];
  const last = messages[messages.length - 1];
  if (last) {
    last.textContent = text;
  } else {
    addMessage('assistant', text);
  }
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle('error', isError);
}

function cardTemplate([label, value]) {
  return `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function numberFrom(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function formatCurrency(value, currency = 'USD') {
  if (value == null) return 'n/a';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

function formatCompactCurrency(value, currency = 'USD') {
  if (value == null) return 'n/a';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value) {
  if (value == null) return 'n/a';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

function formatPercent(value) {
  if (value == null) return 'n/a';
  return `${(value * 100).toFixed(2)}%`;
}

function formatSigned(value) {
  if (value == null) return 'n/a';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
}
