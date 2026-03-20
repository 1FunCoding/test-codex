const state = {
  stock: null,
  symbolMatches: [],
  searchDebounceId: null,
  chartRange: '6M',
};

const elements = {
  stockForm: document.querySelector('#stock-form'),
  tickerInput: document.querySelector('#ticker-input'),
  symbolResults: document.querySelector('#symbol-results'),
  status: document.querySelector('#status'),
  companyName: document.querySelector('#company-name'),
  companySummary: document.querySelector('#company-summary'),
  priceBadge: document.querySelector('#price-badge'),
  heroStats: document.querySelector('#hero-stats'),
  priceChart: document.querySelector('#price-chart'),
  chartRangeLabel: document.querySelector('#chart-range-label'),
  chartRangeButtons: document.querySelectorAll('.chart-range-btn'),
  metricsGrid: document.querySelector('#metrics-grid'),
  incomeList: document.querySelector('#income-list'),
  balanceList: document.querySelector('#balance-list'),
  narrative: document.querySelector('#narrative'),
  chatLog: document.querySelector('#chat-log'),
  chatForm: document.querySelector('#chat-form'),
  chatInput: document.querySelector('#chat-input'),
  goodSignals: document.querySelector('#good-signals'),
  badSignals: document.querySelector('#bad-signals'),
  signalScore: document.querySelector('#signal-score'),
  signalVerdict: document.querySelector('#signal-verdict'),
  quickPicks: document.querySelectorAll('.chip'),
};

initialize();

function initialize() {
  elements.stockForm.addEventListener('submit', handleStockLookup);
  elements.tickerInput.addEventListener('input', handleTickerInput);
  elements.tickerInput.addEventListener('focus', () => {
    if (state.symbolMatches.length) renderSymbolResults(state.symbolMatches);
  });
  document.addEventListener('click', (event) => {
    if (!elements.symbolResults.contains(event.target) && event.target !== elements.tickerInput) {
      clearSymbolResults();
    }
  });
  elements.chatForm.addEventListener('submit', handleChatSubmit);
  elements.quickPicks.forEach((chip) => {
    chip.addEventListener('click', () => {
      elements.tickerInput.value = chip.dataset.symbol;
      elements.stockForm.requestSubmit();
    });
  });
  elements.chartRangeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextRange = button.dataset.range;
      if (!nextRange || nextRange === state.chartRange) return;
      state.chartRange = nextRange;
      syncChartRangeButtons();
      renderPriceChart(state.stock?.priceHistory || [], state.stock?.currency || 'USD');
    });
  });
  renderMetrics([]);
  renderSignalLists([], []);
  renderSignalSummary(null);
  syncChartRangeButtons();
  renderPriceChart([], 'USD');
}

async function handleStockLookup(event) {
  event.preventDefault();
  const ticker = resolveTickerInput(elements.tickerInput.value);
  if (!ticker) return;

  clearSymbolResults();
  setStatus(`Loading live data for ${ticker}...`);

  try {
    const normalized = await fetchBackendStock(ticker);
    if (!normalized?.symbol) {
      throw new Error('No stock data returned for this symbol.');
    }
    state.stock = normalized;
    renderStock(normalized);
    addMessage('assistant', `Loaded ${normalized.companyName} (${normalized.symbol}). Ask me about valuation, margins, leverage, or risks.`);
    setStatus(`Loaded real-time stock data for ${normalized.symbol}.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message, true);
  }
}

function handleTickerInput() {
  const query = elements.tickerInput.value.trim();

  if (state.searchDebounceId) {
    clearTimeout(state.searchDebounceId);
  }

  if (query.length < 2) {
    clearSymbolResults();
    return;
  }

  state.searchDebounceId = setTimeout(async () => {
    try {
      const matches = await fetchSymbolSearch(query);
      state.symbolMatches = matches;
      renderSymbolResults(matches);
    } catch (error) {
      console.error(error);
      clearSymbolResults();
    }
  }, 350);
}

async function fetchSymbolSearch(keywords) {
  const params = new URLSearchParams({ query: keywords });
  const response = await fetch(`/api/search?${params.toString()}`);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Search failed.');
  }
  return payload.matches || [];
}

function renderSymbolResults(matches) {
  if (!matches.length) {
    elements.symbolResults.innerHTML = '<p class="symbol-empty">No matching stocks found yet.</p>';
    return;
  }
  elements.symbolResults.innerHTML = matches
    .map(
      (item) => `
      <button class="symbol-option" type="button" data-symbol="${item.symbol}">
        <strong>${item.symbol}</strong>
        <span>${item.name}</span>
        <small>${item.region || 'N/A'} • ${item.type || 'N/A'} • ${item.currency || 'N/A'}</small>
      </button>
    `
    )
    .join('');

  elements.symbolResults.querySelectorAll('.symbol-option').forEach((button) => {
    button.addEventListener('click', () => {
      const symbol = button.dataset.symbol;
      elements.tickerInput.value = symbol;
      clearSymbolResults();
      elements.stockForm.requestSubmit();
    });
  });
}

function clearSymbolResults() {
  state.symbolMatches = [];
  elements.symbolResults.innerHTML = '';
}

function resolveTickerInput(rawInput) {
  const value = rawInput.trim().toUpperCase();
  if (!value) return '';
  const bracketMatch = value.match(/\(([A-Z.\-]+)\)$/);
  if (bracketMatch?.[1]) return bracketMatch[1];
  const exactMatch = state.symbolMatches.find((item) => item.symbol.toUpperCase() === value);
  if (exactMatch) return exactMatch.symbol.toUpperCase();
  const firstToken = value.split(/\s+/)[0];
  return firstToken;
}

async function fetchBackendStock(symbol) {
  const params = new URLSearchParams({ symbol });
  const response = await fetch(`/api/stock?${params.toString()}`);
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Stock lookup failed.');
  }
  return payload.stock;
}

function renderStock(stock) {
  const reportingCurrency = stock.reportingCurrency || stock.currency;
  elements.companyName.textContent = `${stock.companyName} (${stock.symbol})`;
  elements.companySummary.textContent = `${stock.sector || 'N/A'} • ${stock.industry || 'N/A'} • ${stock.exchange || 'N/A'} • Latest annual period: ${stock.fiscalDateEnding || 'N/A'} • Reporting currency: ${reportingCurrency}`;
  elements.priceBadge.classList.remove('muted');
  elements.priceBadge.innerHTML = `${formatCurrency(stock.price, stock.currency)}<small>${formatSigned(stock.priceChange)} (${stock.priceChangePercent || 'n/a'})</small>`;

  const heroStats = [
    ['Market cap', formatCompactCurrency(stock.marketCap, stock.currency)],
    ['P/E ratio', formatNumber(stock.peRatio)],
    ['EPS', formatCurrency(stock.eps, stock.currency)],
    ['Profit margin', formatPercent(stock.profitMargin)],
  ];
  elements.heroStats.innerHTML = heroStats.map(cardTemplate).join('');
  renderPriceChart(stock.priceHistory, stock.currency);

  const metricCards = [
    ['Revenue', formatCompactCurrency(stock.revenue, reportingCurrency)],
    ['Net income', formatCompactCurrency(stock.netIncome, reportingCurrency)],
    ['Operating margin', formatPercent(stock.operatingMargin)],
    ['Gross margin', formatPercent(stock.grossMargin)],
    ['Price / sales', formatNumber(stock.priceToSales)],
    ['Return on assets', formatPercent(stock.returnOnAssets)],
    ['Return on equity', formatPercent(stock.returnOnEquity)],
    ['Current ratio', formatNumber(stock.currentRatio)],
    ['Debt / equity', formatNumber(stock.debtToEquity)],
    ['Cash ratio', formatNumber(stock.cashRatio)],
    ['EBITDA', formatCompactCurrency(stock.ebitda, reportingCurrency)],
    ['Forward div yield', formatPercent(forwardDivYield(stock))],
  ];
  renderMetrics(metricCards);

  renderDataList(elements.incomeList, [
    ['Revenue', formatCompactCurrency(stock.revenue, reportingCurrency)],
    ['Gross profit', formatCompactCurrency(stock.grossProfit, reportingCurrency)],
    ['Operating income', formatCompactCurrency(stock.operatingIncome, reportingCurrency)],
    ['Net income', formatCompactCurrency(stock.netIncome, reportingCurrency)],
    ['EBITDA', formatCompactCurrency(stock.ebitda, reportingCurrency)],
  ]);

  renderDataList(elements.balanceList, [
    ['Total assets', formatCompactCurrency(stock.totalAssets, reportingCurrency)],
    ['Total liabilities', formatCompactCurrency(stock.totalLiabilities, reportingCurrency)],
    ['Shareholder equity', formatCompactCurrency(stock.totalEquity, reportingCurrency)],
    ['Current assets', formatCompactCurrency(stock.currentAssets, reportingCurrency)],
    ['Current liabilities', formatCompactCurrency(stock.currentLiabilities, reportingCurrency)],
    ['Cash & equivalents', formatCompactCurrency(stock.cash, reportingCurrency)],
  ]);

  elements.narrative.textContent = buildNarrative(stock);
  const signals = buildInvestorSignals(stock);
  renderSignalLists(signals.good, signals.bad);
  renderSignalSummary(signals.score);
}

function renderMetrics(metrics) {
  elements.metricsGrid.innerHTML = metrics.length
    ? metrics.map(([label, value]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong></article>`).join('')
    : '<article class="metric-card"><span>Awaiting data</span><strong>Load a ticker</strong></article>';
}

function renderDataList(target, items) {
  target.innerHTML = items.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('');
}

function renderPriceChart(history, currency = 'USD') {
  const filteredHistory = filterHistoryByRange(Array.isArray(history) ? history : [], state.chartRange);
  const points = filteredHistory.filter((row) => row && Number.isFinite(Number.parseFloat(row.close)));

  if (points.length < 2) {
    elements.priceChart.innerHTML = '<p class="chart-empty">Load a ticker to see the stock price trend.</p>';
    elements.chartRangeLabel.textContent = 'Awaiting data';
    return;
  }

  const closes = points.map((row) => Number.parseFloat(row.close));
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const width = 760;
  const height = 244;
  const padX = 12;
  const padY = 14;
  const xAxisHeight = 24;
  const yAxisWidth = 64;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2 - xAxisHeight;
  const plotLeft = padX;
  const plotRight = width - padX - yAxisWidth;
  const plotWidth = Math.max(plotRight - plotLeft, 10);

  const yTicks = 5;
  const tickData = Array.from({ length: yTicks }, (_, idx) => {
    const ratio = idx / (yTicks - 1);
    const value = max - range * ratio;
    const y = padY + innerH * ratio;
    return { value, y };
  });

  const linePoints = points
    .map((row, idx) => {
      const x = plotLeft + (idx / (points.length - 1)) * plotWidth;
      const y = padY + ((max - Number.parseFloat(row.close)) / range) * innerH;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPath = `M ${plotLeft},${height - padY} L ${linePoints} L ${plotRight},${height - padY} Z`;
  const trendUp = closes[closes.length - 1] >= closes[0];
  const stroke = trendUp ? '#10b981' : '#ef4444';
  const fill = trendUp ? 'rgba(16,185,129,0.16)' : 'rgba(239,68,68,0.16)';
  const firstDate = formatChartDate(points[0].date);
  const lastDate = formatChartDate(points[points.length - 1].date);
  elements.chartRangeLabel.textContent = `${firstDate} -> ${lastDate}`;
  const gridLines = tickData
    .map(({ y }) => `<line x1="${plotLeft}" y1="${y.toFixed(2)}" x2="${plotRight}" y2="${y.toFixed(2)}"></line>`)
    .join('');
  const yLabels = tickData
    .map(
      ({ value, y }) =>
        `<text x="${width - padX}" y="${(y + 4).toFixed(2)}" text-anchor="end">${escapeHtml(formatCurrency(value, currency))}</text>`
    )
    .join('');
  const xTicks = 4;
  const xTickData = Array.from({ length: xTicks }, (_, idx) => {
    const ratio = idx / (xTicks - 1);
    const pointIdx = Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1))));
    const x = plotLeft + ratio * plotWidth;
    const dateLabel = formatChartDate(points[pointIdx]?.date, { month: 'short', day: 'numeric' });
    return { x, dateLabel };
  });
  const xTickLines = xTickData
    .map(({ x }) => `<line x1="${x.toFixed(2)}" y1="${(height - padY - xAxisHeight).toFixed(2)}" x2="${x.toFixed(2)}" y2="${(height - padY - xAxisHeight + 6).toFixed(2)}"></line>`)
    .join('');
  const xLabels = xTickData
    .map(({ x, dateLabel }) => `<text x="${x.toFixed(2)}" y="${(height - padY + 14).toFixed(2)}" text-anchor="middle">${escapeHtml(dateLabel)}</text>`)
    .join('');

  elements.priceChart.innerHTML = `
    <div class="chart-main">
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Stock price trend chart">
        <g class="chart-grid">${gridLines}</g>
        <path d="${areaPath}" fill="${fill}"></path>
        <polyline fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${linePoints}"></polyline>
        <line class="chart-axis" x1="${plotLeft}" y1="${height - padY - xAxisHeight}" x2="${plotRight}" y2="${height - padY - xAxisHeight}"></line>
        <line class="chart-axis" x1="${plotRight}" y1="${padY}" x2="${plotRight}" y2="${height - padY}"></line>
        <g class="chart-y-labels">${yLabels}</g>
        <g class="chart-x-ticks">${xTickLines}</g>
        <g class="chart-x-labels">${xLabels}</g>
      </svg>
      <div class="chart-footer">
        <article class="chart-stat">
          <small>Low</small>
          <strong>${formatCurrency(min, currency)}</strong>
        </article>
        <article class="chart-stat">
          <small>High</small>
          <strong>${formatCurrency(max, currency)}</strong>
        </article>
        <article class="chart-stat latest">
          <small>Latest</small>
          <strong>${formatCurrency(closes[closes.length - 1], currency)}</strong>
        </article>
      </div>
    </div>
  `;
}

function filterHistoryByRange(history, range) {
  const days = rangeDays(range);
  if (days == null) return history;
  const latestPoint = history[history.length - 1];
  const latestTime = latestPoint?.date ? new Date(latestPoint.date).getTime() : Date.now();
  const cutoff = latestTime - days * 24 * 60 * 60 * 1000;
  const filtered = history.filter((point) => {
    const time = new Date(point.date).getTime();
    return Number.isFinite(time) && time >= cutoff;
  });
  return filtered.length >= 2 ? filtered : history;
}

function rangeDays(range) {
  if (range === '1M') return 30;
  if (range === '3M') return 90;
  if (range === '6M') return 180;
  if (range === '1Y') return 365;
  return null;
}

function syncChartRangeButtons() {
  elements.chartRangeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.range === state.chartRange);
  });
}

function formatChartDate(raw, options = { month: 'short', day: 'numeric' }) {
  if (!raw) return 'n/a';
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);
  return date.toLocaleDateString('en-US', options);
}

function buildNarrative(stock) {
  const reportingCurrency = stock.reportingCurrency || stock.currency;
  const valuation = stock.peRatio
    ? `The stock trades at about ${formatNumber(stock.peRatio)}x earnings and ${formatNumber(stock.priceToSales)}x sales.`
    : 'The valuation snapshot is incomplete because earnings-based ratios are unavailable.';
  const profitability = `Profitability shows ${formatPercent(stock.profitMargin)} net margin and ${formatPercent(stock.operatingMargin)} operating margin on ${formatCompactCurrency(stock.revenue, reportingCurrency)} of revenue.`;
  const balanceSheet = `The balance sheet reports ${formatCompactCurrency(stock.totalAssets, reportingCurrency)} in assets, ${formatCompactCurrency(stock.totalLiabilities, reportingCurrency)} in liabilities, a current ratio of ${formatNumber(stock.currentRatio)}, and debt/equity of ${formatNumber(stock.debtToEquity)}.`;
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
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      stock,
    }),
  });

  const payload = await readJsonSafe(response);
  if (!response.ok) {
    const detailedMessage = extractApiErrorMessage(payload) || `AI request failed (${response.status}).`;
    throw new Error(detailedMessage);
  }

  return payload?.answer?.trim() || 'No answer returned.';
}

async function readJsonSafe(response) {
  const raw = await response.text();
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw || 'Non-JSON response returned by API.' };
  }
}

function extractApiErrorMessage(payload) {
  if (Array.isArray(payload)) {
    return extractApiErrorMessage(payload[0]);
  }

  if (!payload || typeof payload !== 'object') {
    return '';
  }

  if (typeof payload.error === 'string') {
    return payload.error;
  }

  if (payload.error && typeof payload.error === 'object' && typeof payload.error.message === 'string') {
    return payload.error.message;
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  return '';
}

function buildInvestorSignals(stock) {
  const good = [];
  const bad = [];
  let score = 50;

  if (stock.profitMargin != null) {
    if (stock.profitMargin >= 0.15) {
      good.push(`Healthy net margin at ${formatPercent(stock.profitMargin)}.`);
      score += 12;
    } else if (stock.profitMargin < 0.05) {
      bad.push(`Thin net margin at ${formatPercent(stock.profitMargin)}.`);
      score -= 12;
    }
  }

  if (stock.returnOnEquity != null) {
    if (stock.returnOnEquity >= 0.15) {
      good.push(`Strong ROE at ${formatPercent(stock.returnOnEquity)}.`);
      score += 10;
    } else if (stock.returnOnEquity < 0.08) {
      bad.push(`Weak ROE at ${formatPercent(stock.returnOnEquity)}.`);
      score -= 10;
    }
  }

  if (stock.currentRatio != null) {
    if (stock.currentRatio >= 1.5) {
      good.push(`Solid short-term liquidity (current ratio ${formatNumber(stock.currentRatio)}).`);
      score += 8;
    } else if (stock.currentRatio < 1) {
      bad.push(`Liquidity risk: current ratio ${formatNumber(stock.currentRatio)}.`);
      score -= 8;
    }
  }

  if (stock.debtToEquity != null) {
    if (stock.debtToEquity <= 1) {
      good.push(`Conservative leverage (debt/equity ${formatNumber(stock.debtToEquity)}).`);
      score += 10;
    } else if (stock.debtToEquity > 2) {
      bad.push(`High leverage (debt/equity ${formatNumber(stock.debtToEquity)}).`);
      score -= 10;
    }
  }

  if (stock.priceToSales != null && stock.profitMargin != null) {
    if (stock.priceToSales > 10 && stock.profitMargin < 0.1) {
      bad.push(`Valuation may be stretched: ${formatNumber(stock.priceToSales)}x sales with modest margin.`);
      score -= 8;
    } else if (stock.priceToSales < 4 && stock.profitMargin >= 0.12) {
      good.push(`Reasonable valuation: ${formatNumber(stock.priceToSales)}x sales with healthy profitability.`);
      score += 8;
    }
  }

  const fwdYield = forwardDivYield(stock);
  if (fwdYield != null && fwdYield >= 0.02) {
      good.push(`Income support from forward div yield of ${formatPercent(fwdYield)}.`);
    score += 4;
  }

  if (!good.length) good.push('No standout strengths from current snapshot. Review growth trends and management quality.');
  if (!bad.length) bad.push('No major red flags in this snapshot. Validate with multi-year trend and peer comparison.');

  score = Math.max(0, Math.min(100, score));
  return { good, bad, score };
}

function renderSignalLists(goodSignals, badSignals) {
  elements.goodSignals.innerHTML = goodSignals.map((item) => `<li>${item}</li>`).join('');
  elements.badSignals.innerHTML = badSignals.map((item) => `<li>${item}</li>`).join('');
}

function renderSignalSummary(score) {
  if (score == null) {
    elements.signalScore.textContent = 'Score: --/100';
    elements.signalVerdict.textContent = 'Load a stock to see a beginner-friendly verdict.';
    return;
  }

  elements.signalScore.textContent = `Score: ${Math.round(score)}/100`;
  let verdict = 'Mixed fundamentals. Dig deeper before deciding.';
  if (score >= 75) verdict = 'Stronger quality snapshot. Still validate growth and valuation trend.';
  else if (score <= 40) verdict = 'Higher risk snapshot. Review debt, profitability trend, and downside scenarios.';
  elements.signalVerdict.textContent = verdict;
}

function addMessage(role, text) {
  const message = document.createElement('div');
  message.className = `message ${role}`;
  setMessageContent(message, role, text);
  elements.chatLog.appendChild(message);
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function replaceLastAssistantMessage(text) {
  const messages = [...elements.chatLog.querySelectorAll('.message.assistant')];
  const last = messages[messages.length - 1];
  if (last) {
    setMessageContent(last, 'assistant', text);
  } else {
    addMessage('assistant', text);
  }
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function setMessageContent(target, role, text) {
  const safeText = typeof text === 'string' ? text : String(text ?? '');
  if (role !== 'assistant') {
    target.textContent = safeText;
    return;
  }
  target.innerHTML = formatAssistantText(safeText);
}

function formatAssistantText(text) {
  const escaped = escapeHtml(text).replace(/\r\n/g, '\n');
  const lines = escaped.split('\n');
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push(`<p>${paragraphLines.join('<br>')}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.map((item) => `<li>${item}</li>`).join('')}</ul>`);
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(`<p><strong>${heading[1]}</strong></p>`);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      listItems.push(bullet[1]);
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return (blocks.join('') || `<p>${escaped}</p>`).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
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

/** Forward annual dividend yield (decimal); matches API `forwardDividendYield`. */
function forwardDivYield(stock) {
  if (!stock || typeof stock !== 'object') return null;
  const v = stock.forwardDividendYield ?? stock.dividendYield;
  return v == null ? null : Number(v);
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
