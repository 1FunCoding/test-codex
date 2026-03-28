const LOCALE_STORAGE_KEY = 'uiLocale';
const VIEW_MODE_STORAGE_KEY = 'pageLayoutMode';
const SEARCH_MIN_CHARS = 3;
const CJK_SEARCH_MIN_CHARS = 2;
const SEARCH_DEBOUNCE_MS = 800;
const HOLDERS_PREFETCH_DELAY_MS = 1500;

const i18n = {
  en: {
    'meta.title': 'AI Stock Tracker',
    'view.groupLabel': 'Page layout',
    'view.dashboard': 'Dashboard',
    'view.claude': 'Claude-style',
    'locale.groupLabel': 'Language switch',
    'header.kicker': 'Live stock research dashboard',
    'header.title': 'AI Stock Tracker',
    'header.copy': 'Search a stock to load live quote, accounting ratios, statement highlights, and AI-guided analysis in one place.',
    'search.title': 'Search Stock',
    'search.subtitle': 'Type a ticker or company name to load live market and financial data.',
    'search.label': 'Ticker or company name',
    'search.placeholder': 'Search stocks like AAPL, NVDA, Microsoft...',
    'search.submit': 'Load Analysis',
    'status.idle': 'Enter a ticker and load real company data.',
    'status.loadingStock': ({ ticker }) => `Loading live data for ${ticker}...`,
    'status.loadedStock': ({ symbol }) => `Loaded real-time stock data for ${symbol}.`,
    'search.noMatches': 'No matching stocks found yet.',
    'search.loadedAssistant': ({ company, symbol }) =>
      `Loaded ${company} (${symbol}). Ask me about valuation, margins, leverage, or risks.`,
    'errors.noStockData': 'No stock data returned for this symbol.',
    'errors.searchFailed': 'Search failed.',
    'errors.stockLookupFailed': 'Stock lookup failed.',
    'errors.rateLimited': ({ seconds }) => `Market data source is temporarily busy. Please wait about ${seconds} seconds and try again.`,
    'errors.aiFailed': ({ message }) => `AI request failed: ${message}`,
    'errors.aiFailedStatus': ({ status }) => `AI request failed (${status}).`,
    'errors.nonJson': 'Non-JSON response returned by API.',
    'common.na': 'n/a',
    'common.awaitingData': 'Awaiting data',
    'common.loadTicker': 'Load a ticker',
    'common.awaitingQuote': 'Awaiting quote',
    'common.asOf': ({ value }) => `As of ${value}`,
    'common.latestAnnualPeriod': ({ date }) => `Latest annual period: ${date}`,
    'common.reportingCurrency': ({ currency }) => `Reporting currency: ${currency}`,
    'spotlight.emptyTitle': 'No stock loaded',
    'spotlight.emptySummary':
      'Search a ticker to stream the company profile, valuation snapshot, and latest reported fundamentals.',
    'spotlight.detailJump': 'View detailed financial data',
    'spotlight.summaryLine': ({ header, fiscalDate, currency }) =>
      `${header} • Latest annual period: ${fiscalDate} • Reporting currency: ${currency}`,
    'metrics.marketCap': 'Market cap',
    'metrics.peRatio': 'P/E ratio',
    'metrics.eps': 'EPS',
    'metrics.profitMargin': 'Profit margin',
    'metrics.revenue': 'Revenue',
    'metrics.netIncome': 'Net income',
    'metrics.operatingMargin': 'Operating margin',
    'metrics.grossMargin': 'Gross margin',
    'metrics.priceToSales': 'Price / sales',
    'metrics.returnOnAssets': 'Return on assets',
    'metrics.returnOnEquity': 'Return on equity',
    'metrics.currentRatio': 'Current ratio',
    'metrics.debtToEquity': 'Debt / equity',
    'metrics.cashRatio': 'Cash ratio',
    'metrics.ebitda': 'EBITDA',
    'metrics.forwardDividendYield': 'Forward div yield',
    'metrics.grossProfit': 'Gross profit',
    'metrics.operatingIncome': 'Operating income',
    'metrics.totalAssets': 'Total assets',
    'metrics.totalLiabilities': 'Total liabilities',
    'metrics.shareholderEquity': 'Shareholder equity',
    'metrics.currentAssets': 'Current assets',
    'metrics.currentLiabilities': 'Current liabilities',
    'metrics.cashAndEquivalents': 'Cash & equivalents',
    'performance.title': 'Performance Analysis',
    'performance.subtitle': 'Real-time price action with a range-based trend view.',
    'performance.rangeAria': 'Chart range',
    'performance.chartEmpty': 'Load a ticker to see the stock price trend.',
    'performance.chartLoadingIntraday': 'Loading 1D intraday chart...',
    'performance.chartUnavailableIntraday': 'Intraday data is temporarily unavailable. Try again later.',
    'performance.chartAria': 'Stock price trend chart',
    'performance.intradayUpdated': 'intraday updated',
    'performance.low': 'Low',
    'performance.high': 'High',
    'performance.latest': 'Latest',
    'finance.title': 'Detailed Financial Data',
    'finance.subtitle': 'Keep the key ratios and latest annual statement figures visible in a dedicated section.',
    'finance.snapshotTitle': 'Accounting Snapshot',
    'finance.snapshotSubtitle': 'Key valuation, profitability, and balance-sheet ratios from the latest report.',
    'finance.statementsTitle': 'Statement Highlights',
    'finance.statementsSubtitle': 'Latest annual income statement and balance sheet data.',
    'finance.incomeStatement': 'Income statement',
    'finance.balanceSheet': 'Balance sheet',
    'signals.title': 'Investor Signal Board',
    'signals.subtitle': 'Strengths, watch-outs, and an overall score from the current snapshot.',
    'signals.positiveTitle': 'Positive signals',
    'signals.riskTitle': 'Risk signals',
    'signals.emptyVerdict': 'Load a stock to see a beginner-friendly verdict.',
    'signals.score': ({ score }) => `Score: ${score}/100`,
    'signals.verdict.mixed': 'Mixed fundamentals. Dig deeper before deciding.',
    'signals.verdict.strong': 'Stronger quality snapshot. Validate growth durability and the valuation you are paying for.',
    'signals.verdict.risk': 'Higher risk snapshot. Review debt, profitability trend, and downside scenarios closely.',
    'signals.good.profitMargin': ({ value }) => `Healthy net margin at ${value}.`,
    'signals.bad.profitMargin': ({ value }) => `Thin net margin at ${value}.`,
    'signals.good.roe': ({ value }) => `Strong ROE at ${value}.`,
    'signals.bad.roe': ({ value }) => `Weak ROE at ${value}.`,
    'signals.good.currentRatio': ({ value }) => `Solid liquidity with current ratio ${value}.`,
    'signals.bad.currentRatio': ({ value }) => `Liquidity risk at current ratio ${value}.`,
    'signals.good.debtToEquity': ({ value }) => `Conservative leverage near ${value}x debt/equity.`,
    'signals.bad.debtToEquity': ({ value }) => `High leverage near ${value}x debt/equity.`,
    'signals.bad.priceToSales': ({ value }) => `Valuation looks stretched at ${value}x sales versus modest margin.`,
    'signals.good.priceToSales': ({ value }) => `Reasonable valuation at ${value}x sales with healthy profitability.`,
    'signals.good.forwardYield': ({ value }) => `Forward dividend yield adds ${value} of income support.`,
    'signals.good.fallback': 'No standout strengths from the current snapshot. Review trend and execution quality next.',
    'signals.bad.fallback': 'No major red flags in this snapshot. Validate with multi-year trend and peer comparison.',
    'narrative.title': 'AI Narrative',
    'narrative.subtitle': 'Short plain-language interpretation of the loaded company snapshot.',
    'narrative.awaitingTitle': 'Awaiting stock context',
    'narrative.awaitingCopy': 'Load a company to generate a short operational, valuation, and balance-sheet readout.',
    'narrative.section.business': 'Business context',
    'narrative.section.valuation': 'Valuation context',
    'narrative.section.balance': 'Balance-sheet context',
    'narrative.section.profitability': 'Profitability context',
    'narrative.section.health': 'Financial health',
    'narrative.valuation.ready': ({ pe, ps }) =>
      `The stock trades near ${pe}x earnings and ${ps}x sales, which frames today's valuation against the latest reported fundamentals.`,
    'narrative.valuation.missing':
      'Valuation multiples are incomplete for this name, so the market is harder to benchmark using earnings or sales today.',
    'narrative.balance': ({ revenue, assets, liabilities, currentRatio }) =>
      `The latest annual snapshot shows ${revenue} of revenue, ${assets} of assets, ${liabilities} of liabilities, and a current ratio of ${currentRatio}.`,
    'narrative.profitability': ({ netMargin, operatingMargin, roe }) =>
      `Profitability reads at ${netMargin} net margin, ${operatingMargin} operating margin, and ${roe} return on equity, which helps frame how efficiently capital is being converted into earnings.`,
    'business.industrySector': ({ industry, sector }) => `It operates in the ${industry} industry within the ${sector} sector.`,
    'business.industryOnly': ({ industry }) => `It operates in the ${industry} industry.`,
    'business.sectorOnly': ({ sector }) => `It operates in the ${sector} sector.`,
    'business.listedOn': ({ exchange }) => `listed on ${exchange}`,
    'business.basedIn': ({ location }) => `based in ${location}`,
    'business.companyLocation': ({ company, details }) => `${company} is ${details}.`,
    'business.employees': ({ company, employees }) => `${company} employs ${employees}.`,
    'business.fallback': ({ company, sector, industry }) =>
      `${company} operates in ${sector} and is categorized under ${industry}.`,
    'narrative.solvency.incomplete':
      'Liquidity and leverage data are incomplete for this name, so the solvency read remains limited.',
    'narrative.solvency.sturdy': ({ currentRatio, debtToEquity }) =>
      `The balance sheet looks sturdy with a current ratio of ${currentRatio} and debt/equity of ${debtToEquity}.`,
    'narrative.solvency.tight': ({ currentRatio, cashRatio }) =>
      `Short-term liquidity is tighter here, with a current ratio of ${currentRatio} and cash ratio of ${cashRatio}.`,
    'narrative.solvency.elevated': ({ debtToEquity }) =>
      `Leverage is elevated at ${debtToEquity}x debt/equity, so financing flexibility deserves a closer read.`,
    'narrative.solvency.default': ({ currentRatio, cashRatio, debtToEquity }) =>
      `Liquidity remains at ${currentRatio} current ratio with ${cashRatio} cash ratio and ${debtToEquity}x debt/equity.`,
    'holders.title': 'Institutional Holders',
    'holders.subtitle': 'Shows holder data from the backend source when available.',
    'holders.kicker': 'Institutional sentiment',
    'holders.fact.count': 'Tracked institutions',
    'holders.fact.topStake': 'Top disclosed stake',
    'holders.fact.totalStake': 'Combined stake',
    'holders.fact.latest': 'Latest filing',
    'holders.summary.readyTitle': 'Top disclosed positions',
    'holders.summary.idleTitle': 'Awaiting holder data',
    'holders.summary.emptyTitle': 'No disclosed holder list yet',
    'holders.summary.readyCopy': ({ totalStake, topStake }) =>
      `Largest disclosed institutions currently account for ${totalStake} combined reported stake, led by a top filing of ${topStake}.`,
    'holders.summary.idleCopy': 'Load a stock to surface the largest disclosed institutions and their reported concentration.',
    'holders.summary.loadingCopy': 'Loading the latest disclosed institutional positions...',
    'holders.summary.emptyCopy': 'The current source did not return a disclosed institutional holder list for this symbol.',
    'holders.summary.errorCopy': 'Institutional holder data is temporarily unavailable. Try again shortly.',
    'holders.spotlight.value': ({ value }) => `Value ${value}`,
    'holders.spotlight.shares': ({ shares }) => `Shares ${shares}`,
    'holders.table.institution': 'Institution',
    'holders.table.shares': 'Shares Held',
    'holders.table.value': 'Position Value',
    'holders.table.reported': 'Reported',
    'holders.table.stake': 'Stake %',
    'holders.emptyIdle': 'Load a stock to see available institutional holder data.',
    'holders.emptySource': 'Institutional holder data is not available for this symbol from the current backend source.',
    'holders.loading': 'Loading institutional holders...',
    'holders.unavailable': 'Institutional holder data is temporarily unavailable. Try again shortly.',
    'holders.unknown': 'Unknown holder',
    'assistant.title': 'Atelier AI Assistant',
    'assistant.subtitle': 'Ready for deep analysis',
    'assistant.initialMessage':
      'Ask about valuation, peer comparisons, growth, or risk. You can also start with one of the quick prompts below.',
    'assistant.placeholder': 'Ask for valuation, peer comps, or key risks...',
    'assistant.button': 'Ask AI',
    'assistant.analysisBadge': 'AI Analysis',
    'assistant.loadingBadge': 'Analyzing',
    'assistant.precondition': 'Search and load a stock first, then I can continue with company-specific analysis.',
    'assistant.promptLabel': 'Quick prompts',
    'assistant.prompt.valuation': 'Is this stock expensive or attractive at the current valuation?',
    'assistant.prompt.peers': 'How does this company compare with its closest peers?',
    'assistant.prompt.risks': 'What are the biggest risks I should watch right now?',
    'assistant.prompt.growth': 'What could drive the company’s next stage of growth?',
    'assistant.loading': 'Analyzing the stock data...',
    'assistant.noAnswer': 'No answer returned.',
    'assistant.expandAria': 'Open fullscreen',
    'assistant.compressAria': 'Exit fullscreen',
  },
  zh: {
    'meta.title': 'AI 股票追踪器',
    'view.groupLabel': '页面布局切换',
    'view.dashboard': '仪表盘',
    'view.claude': 'Claude 风格',
    'locale.groupLabel': '界面语言切换',
    'header.kicker': '实时股票研究看板',
    'header.title': 'AI 股票追踪器',
    'header.copy': '搜索股票，一站加载实时行情、会计比率、报表摘要和 AI 辅助分析。',
    'search.title': '搜索股票',
    'search.subtitle': '输入股票代码或公司名称，加载实时行情和财务数据。',
    'search.label': '股票代码或公司名称',
    'search.placeholder': '搜索 AAPL、NVDA、Microsoft 等股票...',
    'search.submit': '加载分析',
    'status.idle': '输入股票代码即可加载真实公司数据。',
    'status.loadingStock': ({ ticker }) => `正在加载 ${ticker} 的实时数据...`,
    'status.loadedStock': ({ symbol }) => `已加载 ${symbol} 的实时股票数据。`,
    'search.noMatches': '还没有找到匹配的股票。',
    'search.loadedAssistant': ({ company, symbol }) =>
      `已加载 ${company}（${symbol}）。你可以继续问我估值、利润率、杠杆或风险。`,
    'errors.noStockData': '这个股票代码没有返回可用数据。',
    'errors.searchFailed': '搜索失败。',
    'errors.stockLookupFailed': '股票查询失败。',
    'errors.rateLimited': ({ seconds }) => `行情数据源触发了频率限制，请大约等待 ${seconds} 秒后再试。`,
    'errors.aiFailed': ({ message }) => `AI 请求失败：${message}`,
    'errors.aiFailedStatus': ({ status }) => `AI 请求失败（${status}）。`,
    'errors.nonJson': 'API 返回的不是 JSON 数据。',
    'common.na': '暂无',
    'common.awaitingData': '等待数据',
    'common.loadTicker': '加载股票',
    'common.awaitingQuote': '等待报价',
    'common.asOf': ({ value }) => `更新时间 ${value}`,
    'common.latestAnnualPeriod': ({ date }) => `最新年报期：${date}`,
    'common.reportingCurrency': ({ currency }) => `报表币种：${currency}`,
    'spotlight.emptyTitle': '尚未加载股票',
    'spotlight.emptySummary': '搜索股票代码后即可查看公司概况、估值快照和最新披露基本面。',
    'spotlight.detailJump': '查看详细财务数据',
    'spotlight.summaryLine': ({ header, fiscalDate, currency }) =>
      `${header} • 最新年报期：${fiscalDate} • 报表币种：${currency}`,
    'metrics.marketCap': '市值',
    'metrics.peRatio': '市盈率',
    'metrics.eps': '每股收益',
    'metrics.profitMargin': '净利率',
    'metrics.revenue': '营收',
    'metrics.netIncome': '净利润',
    'metrics.operatingMargin': '营业利润率',
    'metrics.grossMargin': '毛利率',
    'metrics.priceToSales': '市销率',
    'metrics.returnOnAssets': '总资产回报率',
    'metrics.returnOnEquity': '净资产回报率',
    'metrics.currentRatio': '流动比率',
    'metrics.debtToEquity': '债务 / 权益',
    'metrics.cashRatio': '现金比率',
    'metrics.ebitda': 'EBITDA',
    'metrics.forwardDividendYield': '远期股息率',
    'metrics.grossProfit': '毛利润',
    'metrics.operatingIncome': '营业利润',
    'metrics.totalAssets': '总资产',
    'metrics.totalLiabilities': '总负债',
    'metrics.shareholderEquity': '股东权益',
    'metrics.currentAssets': '流动资产',
    'metrics.currentLiabilities': '流动负债',
    'metrics.cashAndEquivalents': '现金及等价物',
    'performance.title': '表现分析',
    'performance.subtitle': '用分区间视图查看实时价格走势。',
    'performance.rangeAria': '图表区间',
    'performance.chartEmpty': '加载股票后即可查看价格走势。',
    'performance.chartLoadingIntraday': '正在加载 1 日分时图...',
    'performance.chartUnavailableIntraday': '分时数据暂时不可用，请稍后再试。',
    'performance.chartAria': '股价走势图',
    'performance.intradayUpdated': '盘中已更新',
    'performance.low': '最低',
    'performance.high': '最高',
    'performance.latest': '最新',
    'finance.title': '详细财务数据',
    'finance.subtitle': '把关键比率和最新年度报表数据集中放在一个独立区域里展示。',
    'finance.snapshotTitle': '财务快照',
    'finance.snapshotSubtitle': '展示最新报告里的估值、盈利能力和资产负债表比率。',
    'finance.statementsTitle': '报表摘要',
    'finance.statementsSubtitle': '展示最新年度利润表和资产负债表数据。',
    'finance.incomeStatement': '利润表',
    'finance.balanceSheet': '资产负债表',
    'signals.title': '投资信号板',
    'signals.subtitle': '从当前快照里提炼优势、风险点和综合评分。',
    'signals.positiveTitle': '正向信号',
    'signals.riskTitle': '风险信号',
    'signals.emptyVerdict': '加载股票后可查看适合入门阅读的结论。',
    'signals.score': ({ score }) => `评分：${score}/100`,
    'signals.verdict.mixed': '基本面信号偏中性，建议继续深挖后再判断。',
    'signals.verdict.strong': '当前快照质量偏强，接下来重点确认增长持续性和你为估值付出的代价。',
    'signals.verdict.risk': '当前快照风险偏高，建议重点检查债务、盈利趋势和下行情景。',
    'signals.good.profitMargin': ({ value }) => `净利率达到 ${value}，盈利质量较稳健。`,
    'signals.bad.profitMargin': ({ value }) => `净利率仅 ${value}，利润垫偏薄。`,
    'signals.good.roe': ({ value }) => `ROE 达到 ${value}，股东资本回报较强。`,
    'signals.bad.roe': ({ value }) => `ROE 仅 ${value}，资本回报偏弱。`,
    'signals.good.currentRatio': ({ value }) => `流动性较稳，流动比率为 ${value}。`,
    'signals.bad.currentRatio': ({ value }) => `流动性存在压力，流动比率仅 ${value}。`,
    'signals.good.debtToEquity': ({ value }) => `杠杆偏稳健，债务 / 权益约为 ${value} 倍。`,
    'signals.bad.debtToEquity': ({ value }) => `杠杆偏高，债务 / 权益约为 ${value} 倍。`,
    'signals.bad.priceToSales': ({ value }) => `在利润率不高的情况下，${value} 倍市销率显得偏贵。`,
    'signals.good.priceToSales': ({ value }) => `在盈利能力较健康的前提下，${value} 倍市销率相对合理。`,
    'signals.good.forwardYield': ({ value }) => `远期股息率约 ${value}，对收益有一定支撑。`,
    'signals.good.fallback': '当前快照里没有特别突出的优势，下一步建议看趋势和执行质量。',
    'signals.bad.fallback': '当前快照里没有明显红旗，建议再结合多年趋势和同业比较确认。',
    'narrative.title': 'AI 解读',
    'narrative.subtitle': '用简洁自然语言解读当前加载的公司快照。',
    'narrative.awaitingTitle': '等待股票上下文',
    'narrative.awaitingCopy': '加载公司后即可生成经营、估值和资产负债表解读。',
    'narrative.section.business': '业务背景',
    'narrative.section.valuation': '估值背景',
    'narrative.section.balance': '资产负债背景',
    'narrative.section.profitability': '盈利能力',
    'narrative.section.health': '财务健康',
    'narrative.valuation.ready': ({ pe, ps }) =>
      `当前估值大致为市盈率 ${pe} 倍、市销率 ${ps} 倍，可用来对照最新披露的基本面。`,
    'narrative.valuation.missing': '这个标的的估值倍数不完整，今天较难用盈利或营收口径做直接估值对标。',
    'narrative.balance': ({ revenue, assets, liabilities, currentRatio }) =>
      `最新年报快照显示，公司营收为 ${revenue}，总资产 ${assets}，总负债 ${liabilities}，流动比率为 ${currentRatio}。`,
    'narrative.profitability': ({ netMargin, operatingMargin, roe }) =>
      `当前盈利能力大致为净利率 ${netMargin}、营业利润率 ${operatingMargin}、ROE ${roe}，可帮助判断资本转化为利润的效率。`,
    'business.industrySector': ({ industry, sector }) => `公司所属行业为 ${industry}，板块为 ${sector}。`,
    'business.industryOnly': ({ industry }) => `公司所属行业为 ${industry}。`,
    'business.sectorOnly': ({ sector }) => `公司所属板块为 ${sector}。`,
    'business.listedOn': ({ exchange }) => `在 ${exchange} 上市`,
    'business.basedIn': ({ location }) => `总部位于 ${location}`,
    'business.companyLocation': ({ company, details }) => `${company} ${details}。`,
    'business.employees': ({ company, employees }) => `${company} 员工规模约为 ${employees}。`,
    'business.fallback': ({ company, sector, industry }) => `${company} 所属板块为 ${sector}，细分行业为 ${industry}。`,
    'narrative.solvency.incomplete': '这个标的的流动性和杠杆数据还不完整，所以偿债判断仍然有限。',
    'narrative.solvency.sturdy': ({ currentRatio, debtToEquity }) =>
      `资产负债表相对稳健，流动比率为 ${currentRatio}，债务 / 权益为 ${debtToEquity}。`,
    'narrative.solvency.tight': ({ currentRatio, cashRatio }) =>
      `短期流动性偏紧，流动比率为 ${currentRatio}，现金比率为 ${cashRatio}。`,
    'narrative.solvency.elevated': ({ debtToEquity }) =>
      `杠杆水平偏高，债务 / 权益达到 ${debtToEquity} 倍，融资弹性值得重点查看。`,
    'narrative.solvency.default': ({ currentRatio, cashRatio, debtToEquity }) =>
      `当前流动比率为 ${currentRatio}，现金比率为 ${cashRatio}，债务 / 权益为 ${debtToEquity} 倍。`,
    'holders.title': '机构持仓',
    'holders.subtitle': '有数据时展示后端返回的机构持仓信息。',
    'holders.kicker': '机构情绪',
    'holders.fact.count': '已跟踪机构数',
    'holders.fact.topStake': '最大披露持股',
    'holders.fact.totalStake': '合计披露持股',
    'holders.fact.latest': '最新披露',
    'holders.summary.readyTitle': '重点披露持仓',
    'holders.summary.idleTitle': '等待持仓数据',
    'holders.summary.emptyTitle': '暂无披露持仓列表',
    'holders.summary.readyCopy': ({ totalStake, topStake }) =>
      `当前披露机构合计持股约为 ${totalStake}，其中最大单笔披露持股为 ${topStake}。`,
    'holders.summary.idleCopy': '加载股票后可查看披露机构中占比最高的持仓与集中度。',
    'holders.summary.loadingCopy': '正在加载最新披露的机构持仓...',
    'holders.summary.emptyCopy': '当前数据源没有返回这个股票的披露机构持仓列表。',
    'holders.summary.errorCopy': '机构持仓数据暂时不可用，请稍后再试。',
    'holders.spotlight.value': ({ value }) => `持仓市值 ${value}`,
    'holders.spotlight.shares': ({ shares }) => `持股数量 ${shares}`,
    'holders.table.institution': '机构',
    'holders.table.shares': '持股数量',
    'holders.table.value': '持仓市值',
    'holders.table.reported': '披露日期',
    'holders.table.stake': '持股占比',
    'holders.emptyIdle': '加载股票后可查看可用的机构持仓数据。',
    'holders.emptySource': '当前后端数据源没有提供这个股票的机构持仓数据。',
    'holders.loading': '正在加载机构持仓...',
    'holders.unavailable': '机构持仓数据暂时不可用，请稍后再试。',
    'holders.unknown': '未知机构',
    'assistant.title': 'Atelier AI 助手',
    'assistant.subtitle': '随时开始深度分析',
    'assistant.initialMessage': '你可以问估值、同行对比、增长逻辑或关键风险，也可以直接点下面的快捷提问开始。',
    'assistant.placeholder': '可以问估值、同行对比或关键风险...',
    'assistant.button': '问 AI',
    'assistant.analysisBadge': 'AI 分析',
    'assistant.loadingBadge': '分析中',
    'assistant.precondition': '先在上方搜索并加载一家公司，我就能继续做有上下文的分析。',
    'assistant.promptLabel': '快捷提问',
    'assistant.prompt.valuation': '这只股票现在的估值贵不贵？',
    'assistant.prompt.peers': '这家公司和同行相比处在什么水平？',
    'assistant.prompt.risks': '当前最值得警惕的风险是什么？',
    'assistant.prompt.growth': '未来一段时间增长主要靠什么驱动？',
    'assistant.loading': '正在分析这只股票的数据...',
    'assistant.noAnswer': '没有返回回答。',
    'assistant.expandAria': '展开全屏',
    'assistant.compressAria': '退出全屏',
  },
};

const state = {
  stock: null,
  symbolMatches: [],
  searchDebounceId: null,
  searchAbortController: null,
  lastSearchQuery: '',
  searchRequestId: 0,
  stockRequestId: 0,
  holdersPrefetchId: null,
  chartRange: '6M',
  locale: getInitialLocale(),
  viewMode: getInitialViewMode(),
};

const elements = {
  stockForm: document.querySelector('#stock-form'),
  searchField: document.querySelector('.search-field'),
  tickerInput: document.querySelector('#ticker-input'),
  symbolResults: document.querySelector('#symbol-results'),
  status: document.querySelector('#status'),
  companyName: document.querySelector('#company-name'),
  companySummary: document.querySelector('#company-summary'),
  priceBadge: document.querySelector('#price-badge'),
  heroStats: document.querySelector('#hero-stats'),
  priceChart: document.querySelector('#price-chart'),
  chartRangeLabel: document.querySelector('#chart-range-label'),
  chartRangeSwitch: document.querySelector('.chart-range-switch'),
  chartRangeThumb: document.querySelector('.chart-range-thumb'),
  chartRangeButtons: document.querySelectorAll('.chart-range-btn'),
  metricsGrid: document.querySelector('#metrics-grid'),
  incomeList: document.querySelector('#income-list'),
  balanceList: document.querySelector('#balance-list'),
  narrative: document.querySelector('#narrative'),
  holdersTableBody: document.querySelector('#holders-table-body'),
  holdersSpotlightTitle: document.querySelector('#holders-spotlight-title'),
  holdersSpotlightCopy: document.querySelector('#holders-spotlight-copy'),
  holdersSpotlightList: document.querySelector('#holders-spotlight-list'),
  holdersFactCount: document.querySelector('#holders-fact-count'),
  holdersFactTopStake: document.querySelector('#holders-fact-top-stake'),
  holdersFactTotalStake: document.querySelector('#holders-fact-total-stake'),
  holdersFactLatest: document.querySelector('#holders-fact-latest'),
  assistantPanel: document.querySelector('.assistant-panel'),
  assistantExpandBtn: document.querySelector('#assistant-expand-btn'),
  chatLog: document.querySelector('#chat-log'),
  chatForm: document.querySelector('#chat-form'),
  chatInput: document.querySelector('#chat-input'),
  assistantPromptButtons: document.querySelectorAll('.assistant-prompt'),
  goodSignals: document.querySelector('#good-signals'),
  badSignals: document.querySelector('#bad-signals'),
  signalScore: document.querySelector('#signal-score'),
  signalVerdict: document.querySelector('#signal-verdict'),
  signalProgressFill: document.querySelector('#signal-progress-fill'),
  quickPicks: document.querySelectorAll('.chip'),
  viewModeButtons: document.querySelectorAll('.view-mode-btn'),
  localeButtons: document.querySelectorAll('.locale-btn'),
  translatable: document.querySelectorAll('[data-i18n]'),
  translatablePlaceholders: document.querySelectorAll('[data-i18n-placeholder]'),
  translatableAria: document.querySelectorAll('[data-i18n-aria-label]'),
};

initialize();

function initialize() {
  applyLocale({ rerender: false });
  applyViewMode({ rerender: false });
  initializeLiquidGlassEffects();
  window.addEventListener('resize', () => syncChartRangeThumb(null, { animate: false }));
  elements.stockForm.addEventListener('submit', handleStockLookup);
  elements.viewModeButtons.forEach((button) => {
    button.addEventListener('click', () => setViewMode(button.dataset.viewMode));
  });
  elements.localeButtons.forEach((button) => {
    button.addEventListener('click', () => setLocale(button.dataset.locale));
  });
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
  if (elements.assistantExpandBtn) {
    elements.assistantExpandBtn.addEventListener('click', toggleAssistantFloat);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.assistantPanel?.classList.contains('is-floating')) {
      collapseAssistantFloat();
    }
  });
  elements.assistantPromptButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const promptKey = button.dataset.promptKey;
      const prompt = promptKey ? t(promptKey) : button.textContent.trim();
      elements.chatInput.value = prompt;
      elements.chatInput.focus();
      elements.chatInput.setSelectionRange(prompt.length, prompt.length);
    });
  });
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
      syncChartRangeButtons({ animate: true });
      if (nextRange === '1D' && state.stock?.symbol) {
        void ensureIntradayHistory(state.stock.symbol);
      }
      renderPriceChart(state.stock);
    });
  });

  renderOverviewPlaceholder();
  renderMetrics([]);
  renderDataList(elements.incomeList, []);
  renderDataList(elements.balanceList, []);
  renderSignalLists([], []);
  renderSignalSummary(null);
  renderNarrative(null);
  renderInstitutionalHolders([], 'USD');
  syncChartRangeButtons({ animate: false });
  renderPriceChart(null);
  setStatus(t('status.idle'));
}

function getInitialLocale() {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'en' || stored === 'zh') return stored;
  } catch {}

  const browserLocale = String(window.navigator?.language || window.navigator?.languages?.[0] || '').toLowerCase();
  return browserLocale.startsWith('zh') ? 'zh' : 'en';
}

function getInitialViewMode() {
  try {
    const stored = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (stored === 'dashboard' || stored === 'claude') return stored;
  } catch {}

  return 'dashboard';
}

// ── Assistant floating fullscreen ─────────────────────────────────────────────

function toggleAssistantFloat() {
  if (elements.assistantPanel?.classList.contains('is-floating')) {
    collapseAssistantFloat();
  } else {
    expandAssistantFloat();
  }
}

function expandAssistantFloat() {
  if (!elements.assistantPanel) return;
  elements.assistantPanel.classList.add('is-floating');
  document.body.style.overflow = 'hidden';
  if (elements.assistantExpandBtn) {
    elements.assistantExpandBtn.setAttribute('aria-label', t('assistant.compressAria'));
  }
}

function collapseAssistantFloat() {
  if (!elements.assistantPanel) return;
  elements.assistantPanel.classList.remove('is-floating');
  document.body.style.overflow = '';
  if (elements.assistantExpandBtn) {
    elements.assistantExpandBtn.setAttribute('aria-label', t('assistant.expandAria'));
  }
}

// ─────────────────────────────────────────────────────────────────────────────

function setLocale(nextLocale) {
  if (!['en', 'zh'].includes(nextLocale) || nextLocale === state.locale) return;
  state.locale = nextLocale;

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  } catch {}

  applyLocale();
}

function setViewMode(nextViewMode) {
  if (!['dashboard', 'claude'].includes(nextViewMode) || nextViewMode === state.viewMode) return;
  state.viewMode = nextViewMode;

  try {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, nextViewMode);
  } catch {}

  applyViewMode();
}

function applyLocale({ rerender = true } = {}) {
  document.documentElement.lang = state.locale === 'zh' ? 'zh-CN' : 'en';
  document.title = t('meta.title');

  elements.translatable.forEach((node) => {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key);
  });
  elements.translatablePlaceholders.forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (key) node.setAttribute('placeholder', t(key));
  });
  elements.translatableAria.forEach((node) => {
    const key = node.dataset.i18nAriaLabel;
    if (key) node.setAttribute('aria-label', t(key));
  });
  elements.localeButtons.forEach((button) => {
    const isActive = button.dataset.locale === state.locale;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  syncChatMessageMeta();

  if (!rerender) return;

  if (state.stock) {
    renderStock(state.stock);
    setStatus(t('status.loadedStock', { symbol: state.stock.symbol }));
  } else {
    renderOverviewPlaceholder();
    renderMetrics([]);
    renderDataList(elements.incomeList, []);
    renderDataList(elements.balanceList, []);
    renderSignalLists([], []);
    renderSignalSummary(null);
    renderNarrative(null);
    renderInstitutionalHolders([], 'USD');
    renderPriceChart(null);
    setStatus(t('status.idle'));
  }

  if (state.symbolMatches.length && elements.symbolResults.innerHTML.trim()) {
    renderSymbolResults(state.symbolMatches);
  }
  syncChartRangeButtons({ animate: false });
}

function applyViewMode({ rerender = true } = {}) {
  document.body.dataset.layoutMode = state.viewMode;
  elements.viewModeButtons.forEach((button) => {
    const isActive = button.dataset.viewMode === state.viewMode;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (!rerender) return;

  window.requestAnimationFrame(() => {
    syncChartRangeButtons({ animate: false });
    renderPriceChart(state.stock);
  });
}

function t(key, params = {}) {
  const table = i18n[state.locale] || i18n.en;
  const fallback = i18n.en;
  const value = table[key] ?? fallback[key] ?? key;
  if (typeof value === 'function') {
    return value(params);
  }
  return String(value).replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? ''));
}

function currentIntlLocale() {
  return state.locale === 'zh' ? 'zh-CN' : 'en-US';
}

function formatChatTimestamp(date) {
  return new Intl.DateTimeFormat(currentIntlLocale(), {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function resolveAssistantBadgeKey(text) {
  const normalized = String(text ?? '').trim();
  const loadingStates = [i18n.en['assistant.loading'], i18n.zh['assistant.loading']].map((value) => String(value).trim());
  if (normalized && loadingStates.includes(normalized)) {
    return 'assistant.loadingBadge';
  }
  return 'assistant.analysisBadge';
}

function syncChatMessageMeta() {
  elements.chatLog.querySelectorAll('.message').forEach((message) => {
    const time = message.querySelector('.message-time');
    if (time) {
      const timestamp = time.dateTime ? new Date(time.dateTime) : new Date();
      const safeTimestamp = Number.isNaN(timestamp.getTime()) ? new Date() : timestamp;
      time.dateTime = safeTimestamp.toISOString();
      time.textContent = formatChatTimestamp(safeTimestamp);
    }

    if (!message.classList.contains('assistant')) return;

    const badge = message.querySelector('.message-badge');
    const body = message.querySelector('.message-body');
    if (badge && body) {
      const badgeKey = resolveAssistantBadgeKey(body.textContent);
      badge.textContent = t(badgeKey);
      message.dataset.variant = badgeKey;
    }
  });
}

function joinWithLocale(items, kind = 'comma') {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return '';
  if (kind === 'comma') {
    return filtered.join(state.locale === 'zh' ? '，' : ', ');
  }
  return filtered.join(' • ');
}

function initializeLiquidGlassEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const liquidTargets = [
    [elements.searchField, 0.9],
    [elements.priceBadge, 0.78],
    [elements.chartRangeSwitch, 0.62],
  ];

  liquidTargets.forEach(([element, intensity]) => attachLiquidGlassEffect(element, intensity));
}

function attachLiquidGlassEffect(element, intensity = 0.7) {
  if (!element) return;

  element.classList.add('liquid-glass');
  element.style.setProperty('--liquid-intensity', String(intensity));

  let frameId = 0;
  let nextState = null;

  const commitState = () => {
    frameId = 0;
    if (!nextState) return;

    element.style.setProperty('--liquid-x', `${nextState.x}%`);
    element.style.setProperty('--liquid-y', `${nextState.y}%`);
    element.style.setProperty('--liquid-x-mirror', `${100 - nextState.x}%`);
    element.style.setProperty('--liquid-y-mirror', `${100 - nextState.y}%`);
    element.style.setProperty('--liquid-opacity', nextState.active ? '1' : '0');
    element.style.setProperty('--liquid-edge-opacity', nextState.active ? '0.94' : '0.68');
  };

  const scheduleState = (stateUpdate) => {
    nextState = stateUpdate;
    if (frameId) return;
    frameId = window.requestAnimationFrame(commitState);
  };

  const resetState = () => {
    scheduleState({ x: 50, y: 50, active: false });
  };

  const activateCenter = () => {
    scheduleState({ x: 50, y: 50, active: true });
  };

  element.addEventListener('pointermove', (event) => {
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 8, 92);
    scheduleState({ x, y, active: true });
  });

  element.addEventListener('pointerenter', activateCenter);
  element.addEventListener('pointerleave', resetState);
  element.addEventListener('focusin', activateCenter);
  element.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!element.matches(':focus-within')) {
        resetState();
      }
    }, 0);
  });

  resetState();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function containsCjkCharacters(value) {
  return /[\u3400-\u9FFF\uF900-\uFAFF]/u.test(String(value || ''));
}

function minimumSearchLength(value) {
  return containsCjkCharacters(value) ? CJK_SEARCH_MIN_CHARS : SEARCH_MIN_CHARS;
}

async function handleStockLookup(event) {
  event.preventDefault();
  const ticker = resolveTickerInput(elements.tickerInput.value);
  if (!ticker) return;
  const previousSymbol = state.stock?.symbol ?? null;

  cancelPendingSearch();
  cancelHoldersPrefetch();
  clearSymbolResults();
  setStatus(t('status.loadingStock', { ticker }));
  const requestId = ++state.stockRequestId;

  try {
    const normalized = await fetchBackendStock(ticker);
    if (requestId !== state.stockRequestId) return;
    if (!normalized?.symbol) {
      throw new Error(t('errors.noStockData'));
    }
    state.stock = normalized;
    renderStock(normalized);
    scheduleInstitutionalHoldersPrefetch(normalized.symbol);
    if (state.chartRange === '1D') {
      void ensureIntradayHistory(normalized.symbol);
    }
    const companyChanged = previousSymbol !== normalized.symbol;
    if (companyChanged) {
      resetAssistantConversation([t('search.loadedAssistant', { company: normalized.companyName, symbol: normalized.symbol })]);
    } else {
      addMessage('assistant', t('search.loadedAssistant', { company: normalized.companyName, symbol: normalized.symbol }));
    }
    setStatus(t('status.loadedStock', { symbol: normalized.symbol }));
  } catch (error) {
    if (requestId !== state.stockRequestId) return;
    console.error(error);
    setStatus(error.message, true);
  }
}

function handleTickerInput() {
  const query = elements.tickerInput.value.trim();
  const minLength = minimumSearchLength(query);
  cancelPendingSearch({ keepLastQuery: query.trim().length >= minLength });

  if (query.length < minLength) {
    clearSymbolResults();
    return;
  }

  state.searchDebounceId = setTimeout(() => {
    void loadSymbolMatches(query);
  }, SEARCH_DEBOUNCE_MS);
}

function cancelPendingSearch({ keepLastQuery = false } = {}) {
  if (state.searchDebounceId) {
    clearTimeout(state.searchDebounceId);
    state.searchDebounceId = null;
  }
  if (state.searchAbortController) {
    state.searchAbortController.abort();
    state.searchAbortController = null;
  }
  if (!keepLastQuery) {
    state.lastSearchQuery = '';
  }
}

function cancelHoldersPrefetch() {
  if (!state.holdersPrefetchId) return;
  clearTimeout(state.holdersPrefetchId);
  state.holdersPrefetchId = null;
}

function hydrateLoadedStock(stock) {
  if (!stock || typeof stock !== 'object') return stock;
  const intradayHistory = Array.isArray(stock.intradayHistory) ? stock.intradayHistory : [];
  const institutionalHolders = Array.isArray(stock.institutionalHolders) ? stock.institutionalHolders : [];
  return {
    ...stock,
    intradayHistory,
    institutionalHolders,
    intradayStatus: stock.intradayStatus || (intradayHistory.length ? 'ready' : 'deferred'),
    holdersStatus: stock.holdersStatus || (institutionalHolders.length ? 'ready' : 'deferred'),
  };
}

async function loadSymbolMatches(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery || (normalizedQuery === state.lastSearchQuery && state.symbolMatches.length)) return;

  if (state.searchAbortController) {
    state.searchAbortController.abort();
  }

  const controller = new AbortController();
  const requestId = ++state.searchRequestId;
  state.searchAbortController = controller;

  try {
    const matches = await fetchSymbolSearch(query, { signal: controller.signal });
    if (requestId !== state.searchRequestId) return;
    if (elements.tickerInput.value.trim().toLowerCase() !== normalizedQuery) return;
    state.lastSearchQuery = normalizedQuery;
    state.symbolMatches = matches;
    renderSymbolResults(matches);
  } catch (error) {
    if (error?.name === 'AbortError') return;
    if (requestId !== state.searchRequestId) return;
    console.error(error);
    clearSymbolResults();
  } finally {
    if (state.searchAbortController === controller) {
      state.searchAbortController = null;
    }
    state.searchDebounceId = null;
  }
}

async function fetchSymbolSearch(keywords, { signal } = {}) {
  const params = new URLSearchParams({ query: keywords });
  const response = await fetch(`/api/search?${params.toString()}`, { signal });
  const payload = await readJsonSafe(response);

  if (!response.ok) {
    throw new Error(resolveApiErrorMessage(payload, 'errors.searchFailed'));
  }
  return payload.matches || [];
}

function scheduleInstitutionalHoldersPrefetch(symbol) {
  cancelHoldersPrefetch();
  state.holdersPrefetchId = setTimeout(() => {
    state.holdersPrefetchId = null;
    void ensureInstitutionalHolders(symbol);
  }, HOLDERS_PREFETCH_DELAY_MS);
}

async function ensureInstitutionalHolders(symbol) {
  if (!state.stock || state.stock.symbol !== symbol) return;
  if (state.stock.holdersStatus === 'loading' || state.stock.holdersStatus === 'ready' || state.stock.holdersStatus === 'empty') {
    return;
  }

  state.stock = { ...state.stock, holdersStatus: 'loading' };
  renderStock(state.stock);

  try {
    const holders = await fetchInstitutionalHolders(symbol);
    if (!state.stock || state.stock.symbol !== symbol) return;
    state.stock = {
      ...state.stock,
      institutionalHolders: holders,
      holdersStatus: holders.length ? 'ready' : 'empty',
    };
    renderStock(state.stock);
  } catch (error) {
    if (!state.stock || state.stock.symbol !== symbol) return;
    console.error(error);
    state.stock = {
      ...state.stock,
      institutionalHolders: [],
      holdersStatus: 'error',
    };
    renderStock(state.stock);
  }
}

async function ensureIntradayHistory(symbol) {
  if (!state.stock || state.stock.symbol !== symbol) return;
  if (state.stock.intradayStatus === 'loading' || state.stock.intradayStatus === 'ready') return;

  state.stock = { ...state.stock, intradayStatus: 'loading' };
  renderStock(state.stock);

  try {
    const history = await fetchIntradayHistory(symbol);
    if (!state.stock || state.stock.symbol !== symbol) return;
    state.stock = {
      ...state.stock,
      intradayHistory: history,
      intradayStatus: history.length ? 'ready' : 'empty',
    };
    renderStock(state.stock);
  } catch (error) {
    if (!state.stock || state.stock.symbol !== symbol) return;
    console.error(error);
    state.stock = {
      ...state.stock,
      intradayHistory: [],
      intradayStatus: 'error',
    };
    renderStock(state.stock);
  }
}

async function fetchIntradayHistory(symbol) {
  const params = new URLSearchParams({ symbol });
  const response = await fetch(`/api/stock/intraday?${params.toString()}`);
  const payload = await readJsonSafe(response);
  if (!response.ok) {
    throw new Error(resolveApiErrorMessage(payload, 'errors.stockLookupFailed'));
  }
  return Array.isArray(payload.history) ? payload.history : [];
}

async function fetchInstitutionalHolders(symbol) {
  const params = new URLSearchParams({ symbol });
  const response = await fetch(`/api/stock/holders?${params.toString()}`);
  const payload = await readJsonSafe(response);
  if (!response.ok) {
    throw new Error(resolveApiErrorMessage(payload, 'errors.stockLookupFailed'));
  }
  return Array.isArray(payload.holders) ? payload.holders : [];
}

function renderSymbolResults(matches) {
  if (!matches.length) {
    elements.symbolResults.innerHTML = `<p class="symbol-empty">${escapeHtml(t('search.noMatches'))}</p>`;
    return;
  }

  const fallback = t('common.na');
  elements.symbolResults.innerHTML = matches
    .map(
      (item) => `
      <button class="symbol-option" type="button" data-symbol="${escapeHtml(item.symbol)}">
        <strong>${escapeHtml(item.symbol)}</strong>
        <span>${escapeHtml(item.name)}</span>
        <small>${escapeHtml(item.region || fallback)} • ${escapeHtml(item.type || fallback)} • ${escapeHtml(item.currency || fallback)}</small>
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
  const payload = await readJsonSafe(response);
  if (!response.ok) {
    throw new Error(resolveApiErrorMessage(payload, 'errors.stockLookupFailed'));
  }
  return hydrateLoadedStock(payload.stock);
}

function renderStock(stock) {
  if (!stock) {
    renderOverviewPlaceholder();
    return;
  }

  const reportingCurrency = stock.reportingCurrency || stock.currency;
  const latestPoint = latestMarketPoint(stock);
  const headerSummary = [
    stock.sector || t('common.na'),
    stock.industry || t('common.na'),
    stock.exchange || t('common.na'),
  ].join(' • ');
  elements.companyName.textContent = `${stock.companyName} (${stock.symbol})`;
  elements.companySummary.textContent = t('spotlight.summaryLine', {
    header: headerSummary,
    fiscalDate: formatFiscalDate(stock.fiscalDateEnding),
    currency: reportingCurrency || t('common.na'),
  });

  elements.priceBadge.classList.remove('muted', 'negative');
  if (stock.priceChange != null && stock.priceChange < 0) {
    elements.priceBadge.classList.add('negative');
  }
  if (stock.price == null) {
    elements.priceBadge.classList.add('muted');
  }
  elements.priceBadge.innerHTML = `
    ${formatCurrency(stock.price, stock.currency)}
    <small>${formatSignedCurrency(stock.priceChange, stock.currency)} • ${stock.priceChangePercent || t('common.na')} • ${latestPoint ? t('common.asOf', { value: formatAsOfLabel(latestPoint.date) }) : t('common.awaitingQuote')}</small>
  `;

  const heroStats = [
    [t('metrics.marketCap'), formatCompactCurrency(stock.marketCap, stock.currency)],
    [t('metrics.peRatio'), formatNumber(stock.peRatio)],
    [t('metrics.eps'), formatCurrency(stock.eps, stock.currency)],
    [t('metrics.profitMargin'), formatPercent(stock.profitMargin)],
  ];
  elements.heroStats.innerHTML = heroStats.map(cardTemplate).join('');

  const metricCards = [
    [t('metrics.revenue'), formatCompactCurrency(stock.revenue, reportingCurrency)],
    [t('metrics.netIncome'), formatCompactCurrency(stock.netIncome, reportingCurrency)],
    [t('metrics.operatingMargin'), formatPercent(stock.operatingMargin)],
    [t('metrics.grossMargin'), formatPercent(stock.grossMargin)],
    [t('metrics.priceToSales'), formatNumber(stock.priceToSales)],
    [t('metrics.returnOnAssets'), formatPercent(stock.returnOnAssets)],
    [t('metrics.returnOnEquity'), formatPercent(stock.returnOnEquity)],
    [t('metrics.currentRatio'), formatNumber(stock.currentRatio)],
    [t('metrics.debtToEquity'), formatNumber(stock.debtToEquity)],
    [t('metrics.cashRatio'), formatNumber(stock.cashRatio)],
    [t('metrics.ebitda'), formatCompactCurrency(stock.ebitda, reportingCurrency)],
    [t('metrics.forwardDividendYield'), formatPercent(forwardDivYield(stock))],
  ];

  renderMetrics(metricCards);
  renderPriceChart(stock);

  const incomeItems = [
    [t('metrics.revenue'), formatCompactCurrency(stock.revenue, reportingCurrency)],
    [t('metrics.grossProfit'), formatCompactCurrency(stock.grossProfit, reportingCurrency)],
    [t('metrics.operatingIncome'), formatCompactCurrency(stock.operatingIncome, reportingCurrency)],
    [t('metrics.netIncome'), formatCompactCurrency(stock.netIncome, reportingCurrency)],
    [t('metrics.ebitda'), formatCompactCurrency(stock.ebitda, reportingCurrency)],
  ];
  const balanceItems = [
    [t('metrics.totalAssets'), formatCompactCurrency(stock.totalAssets, reportingCurrency)],
    [t('metrics.totalLiabilities'), formatCompactCurrency(stock.totalLiabilities, reportingCurrency)],
    [t('metrics.shareholderEquity'), formatCompactCurrency(stock.totalEquity, reportingCurrency)],
    [t('metrics.currentAssets'), formatCompactCurrency(stock.currentAssets, reportingCurrency)],
    [t('metrics.currentLiabilities'), formatCompactCurrency(stock.currentLiabilities, reportingCurrency)],
    [t('metrics.cashAndEquivalents'), formatCompactCurrency(stock.cash, reportingCurrency)],
  ];

  renderDataList(elements.incomeList, incomeItems);
  renderDataList(elements.balanceList, balanceItems);
  renderNarrative(stock);

  const signals = buildInvestorSignals(stock);
  renderSignalLists(signals.good, signals.bad);
  renderSignalSummary(signals.score);
  renderInstitutionalHolders(stock.institutionalHolders || [], stock.currency, stock.holdersStatus);
}

function renderOverviewPlaceholder() {
  elements.companyName.textContent = t('spotlight.emptyTitle');
  elements.companySummary.textContent = t('spotlight.emptySummary');
  elements.priceBadge.classList.remove('negative');
  elements.priceBadge.classList.add('muted');
  elements.priceBadge.innerHTML = `--<small>${escapeHtml(t('common.awaitingQuote'))}</small>`;
  elements.heroStats.innerHTML = [
    [t('metrics.marketCap'), '--'],
    [t('metrics.peRatio'), '--'],
    [t('metrics.eps'), '--'],
    [t('metrics.profitMargin'), '--'],
  ].map(cardTemplate).join('');
}

function renderMetrics(metrics) {
  elements.metricsGrid.innerHTML = metrics.length
    ? metrics
        .map(([label, value]) => `<article class="metric-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`)
        .join('')
    : `<article class="metric-card"><span>${escapeHtml(t('common.awaitingData'))}</span><strong>${escapeHtml(
        t('common.loadTicker')
      )}</strong></article>`;
}

function renderDataList(target, items) {
  target.innerHTML = items.length
    ? items.map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join('')
    : `<dt>${escapeHtml(t('common.awaitingData'))}</dt><dd>${escapeHtml(t('common.loadTicker'))}</dd>`;
}

function renderNarrative(stock) {
  if (!stock) {
    elements.narrative.innerHTML = `
      <article class="narrative-item">
        <h3>${escapeHtml(t('narrative.awaitingTitle'))}</h3>
        <p>${escapeHtml(t('narrative.awaitingCopy'))}</p>
      </article>
    `;
    return;
  }

  const sections = buildNarrativeSections(stock);
  elements.narrative.innerHTML = sections
    .map(
      (section) => `
        <article class="narrative-item">
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.body)}</p>
        </article>
      `
    )
    .join('');
}

function buildNarrativeSections(stock) {
  const reportingCurrency = stock.reportingCurrency || stock.currency;
  const valuation = stock.peRatio != null || stock.priceToSales != null
    ? t('narrative.valuation.ready', {
        pe: formatNumber(stock.peRatio),
        ps: formatNumber(stock.priceToSales),
      })
    : t('narrative.valuation.missing');
  const operations = buildBusinessContext(stock);
  const balanceSheet = t('narrative.balance', {
    revenue: formatCompactCurrency(stock.revenue, reportingCurrency),
    assets: formatCompactCurrency(stock.totalAssets, reportingCurrency),
    liabilities: formatCompactCurrency(stock.totalLiabilities, reportingCurrency),
    currentRatio: formatNumber(stock.currentRatio),
  });
  const profitability = t('narrative.profitability', {
    netMargin: formatPercent(stock.profitMargin),
    operatingMargin: formatPercent(stock.operatingMargin),
    roe: formatPercent(stock.returnOnEquity),
  });
  const solvency = buildSolvencyNote(stock);

  return [
    { title: t('narrative.section.business'), body: operations },
    { title: t('narrative.section.valuation'), body: valuation },
    { title: t('narrative.section.balance'), body: balanceSheet },
    { title: t('narrative.section.profitability'), body: profitability },
    { title: t('narrative.section.health'), body: solvency },
  ];
}

function buildBusinessContext(stock) {
  const summary = summarizeBusinessDescription(stock.description, stock.companyName);
  const profileBits = [];

  if (stock.industry && stock.sector) {
    profileBits.push(t('business.industrySector', { industry: stock.industry, sector: stock.sector }));
  } else if (stock.industry) {
    profileBits.push(t('business.industryOnly', { industry: stock.industry }));
  } else if (stock.sector) {
    profileBits.push(t('business.sectorOnly', { sector: stock.sector }));
  }

  const location = formatBusinessLocation(stock);
  const employees = formatEmployeeSummary(stock.fullTimeEmployees);
  const companyLabel = stock.companyName || (state.locale === 'zh' ? '该公司' : 'The company');
  const companyLocationBits = [];
  if (stock.exchange) companyLocationBits.push(t('business.listedOn', { exchange: stock.exchange }));
  if (location) companyLocationBits.push(t('business.basedIn', { location }));
  if (companyLocationBits.length) {
    profileBits.push(t('business.companyLocation', { company: companyLabel, details: joinWithLocale(companyLocationBits) }));
  }
  if (employees) {
    profileBits.push(t('business.employees', { company: companyLabel, employees }));
  }

  if (summary && profileBits.length) {
    return `${summary} ${profileBits.join(' ')}`.trim();
  }
  if (summary) return summary;
  if (profileBits.length) return profileBits.join(' ');

  return t('business.fallback', {
    company: stock.companyName || (state.locale === 'zh' ? '该公司' : 'The company'),
    sector: stock.sector || t('common.na'),
    industry: stock.industry || t('common.na'),
  });
}

function summarizeBusinessDescription(description, companyName) {
  const sentences = splitSentences(description).filter((sentence) => isMeaningfulBusinessSentence(sentence, companyName));
  if (!sentences.length) return '';

  const selected = [ensureBusinessSentenceHasSubject(sentences[0], companyName)];
  if (sentences[0].length < 120 && sentences[1] && sentences[1].length <= 140) {
    selected.push(ensureBusinessSentenceHasSubject(sentences[1], companyName));
  }

  return trimSentenceBlock(selected.join(' '), 280);
}

function splitSentences(text) {
  if (!text) return [];
  const cleaned = String(text).replace(/\s+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [cleaned];
  return mergeCorporateSuffixFragments(sentences);
}

function mergeCorporateSuffixFragments(sentences) {
  const merged = [];

  for (let index = 0; index < sentences.length; index += 1) {
    const current = sentences[index];
    const next = sentences[index + 1];

    if (current && next && shouldMergeCorporateSuffixSentence(current, next)) {
      merged.push(`${current} ${next}`.trim());
      index += 1;
      continue;
    }

    merged.push(current);
  }

  return merged;
}

function shouldMergeCorporateSuffixSentence(current, next) {
  return /\b(inc|corp|corporation|co|company|ltd|limited|llc|plc|sa|n\.v)\.$/i.test(current.trim()) && /^[a-z]/.test(next.trim());
}

function isMeaningfulBusinessSentence(sentence, companyName) {
  if (!sentence) return false;
  const cleaned = sentence.trim();
  if (cleaned.length < 24 || cleaned.split(/\s+/).length < 4) return false;

  const normalizedSentence = normalizeNarrativeToken(cleaned);
  const normalizedCompany = normalizeNarrativeToken(companyName);
  if (normalizedCompany && normalizedSentence === normalizedCompany) return false;

  return true;
}

function normalizeNarrativeToken(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function ensureBusinessSentenceHasSubject(sentence, companyName) {
  if (!sentence) return '';

  const cleaned = sentence.trim();
  const normalizedSentence = normalizeNarrativeToken(cleaned);
  const normalizedCompany = normalizeNarrativeToken(companyName);
  if (normalizedCompany && normalizedSentence.includes(normalizedCompany)) {
    return cleaned;
  }
  if (/^[a-z]/.test(cleaned) && companyName) {
    return `${companyName} ${cleaned}`;
  }
  return cleaned;
}

function trimSentenceBlock(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength);
  return `${clipped.slice(0, clipped.lastIndexOf(' ')).trim()}...`;
}

function formatBusinessLocation(stock) {
  return joinWithLocale([stock.city, stock.state, stock.country]);
}

function formatEmployeeSummary(value) {
  const employees = numberFrom(value);
  if (employees == null || employees <= 0) return '';
  if (state.locale === 'zh') {
    return `${formatCompactNumber(employees)} 名员工`;
  }
  return `about ${formatCompactNumber(employees)} people`;
}

function renderInstitutionalHolders(holders, currency = 'USD', status = 'idle') {
  renderInstitutionalHolderShowcase(holders, currency, status);

  if (!holders.length) {
    let message = state.stock ? t('holders.emptySource') : t('holders.emptyIdle');
    if (status === 'loading' || status === 'deferred') {
      message = t('holders.loading');
    } else if (status === 'error') {
      message = t('holders.unavailable');
    }
    elements.holdersTableBody.innerHTML = `
      <tr class="table-empty-row">
        <td colspan="5">${escapeHtml(message)}</td>
      </tr>
    `;
    return;
  }

  elements.holdersTableBody.innerHTML = holders
    .map(
      (holder) => `
        <tr>
          <td>${escapeHtml(holder.name || t('holders.unknown'))}</td>
          <td>${escapeHtml(formatInteger(holder.shares))}</td>
          <td>${escapeHtml(formatCompactCurrency(holder.value, currency))}</td>
          <td>${escapeHtml(formatReportedDate(holder.reportDate))}</td>
          <td>${escapeHtml(formatPercent(holder.pctHeld))}</td>
        </tr>
      `
    )
    .join('');
}

function renderInstitutionalHolderShowcase(holders, currency = 'USD', status = 'idle') {
  const hasStock = Boolean(state.stock);
  if (!holders.length) {
    const emptyState = resolveHolderShowcaseEmptyState(status, hasStock);
    elements.holdersSpotlightTitle.textContent = emptyState.title;
    elements.holdersSpotlightCopy.textContent = emptyState.copy;
    elements.holdersSpotlightList.innerHTML = `<li class="holders-spotlight-empty">${escapeHtml(emptyState.listMessage)}</li>`;
    elements.holdersFactCount.textContent = '--';
    elements.holdersFactTopStake.textContent = '--';
    elements.holdersFactTotalStake.textContent = '--';
    elements.holdersFactLatest.textContent = '--';
    return;
  }

  const rankedHolders = rankInstitutionalHolders(holders);
  const featuredHolders = rankedHolders.slice(0, 3);
  const totalStake = sumInstitutionalStake(holders);
  const topStake = numberFrom(featuredHolders[0]?.pctHeld);
  const latestReport = getLatestInstitutionalReportDate(holders);

  elements.holdersSpotlightTitle.textContent = t('holders.summary.readyTitle');
  elements.holdersSpotlightCopy.textContent = t('holders.summary.readyCopy', {
    totalStake: formatPercent(totalStake),
    topStake: formatPercent(topStake),
  });
  elements.holdersSpotlightList.innerHTML = featuredHolders
    .map(
      (holder) => `
        <li class="holders-spotlight-item">
          <div class="holders-spotlight-row">
            <strong>${escapeHtml(holder.name || t('holders.unknown'))}</strong>
            <span>${escapeHtml(formatPercent(numberFrom(holder.pctHeld)))}</span>
          </div>
          <p>${escapeHtml(
            joinWithLocale([
              t('holders.spotlight.value', { value: formatCompactCurrency(holder.value, currency) }),
              t('holders.spotlight.shares', { shares: formatInteger(holder.shares) }),
            ])
          )}</p>
        </li>
      `
    )
    .join('');

  elements.holdersFactCount.textContent = formatInteger(holders.length);
  elements.holdersFactTopStake.textContent = formatPercent(topStake);
  elements.holdersFactTotalStake.textContent = formatPercent(totalStake);
  elements.holdersFactLatest.textContent = formatReportedDate(latestReport);
}

function resolveHolderShowcaseEmptyState(status, hasStock) {
  if (status === 'loading' || status === 'deferred') {
    return {
      title: t('holders.summary.idleTitle'),
      copy: t('holders.summary.loadingCopy'),
      listMessage: t('holders.loading'),
    };
  }

  if (status === 'error') {
    return {
      title: t('holders.summary.emptyTitle'),
      copy: t('holders.summary.errorCopy'),
      listMessage: t('holders.unavailable'),
    };
  }

  if (hasStock) {
    return {
      title: t('holders.summary.emptyTitle'),
      copy: t('holders.summary.emptyCopy'),
      listMessage: t('holders.emptySource'),
    };
  }

  return {
    title: t('holders.summary.idleTitle'),
    copy: t('holders.summary.idleCopy'),
    listMessage: t('holders.emptyIdle'),
  };
}

function rankInstitutionalHolders(holders) {
  return [...holders].sort((left, right) => {
    const stakeDelta = (numberFrom(right?.pctHeld) ?? -1) - (numberFrom(left?.pctHeld) ?? -1);
    if (stakeDelta !== 0) return stakeDelta;

    const valueDelta = (numberFrom(right?.value) ?? -1) - (numberFrom(left?.value) ?? -1);
    if (valueDelta !== 0) return valueDelta;

    return (numberFrom(right?.shares) ?? -1) - (numberFrom(left?.shares) ?? -1);
  });
}

function sumInstitutionalStake(holders) {
  return holders.reduce((total, holder) => total + (numberFrom(holder?.pctHeld) ?? 0), 0);
}

function getLatestInstitutionalReportDate(holders) {
  const latest = holders
    .map((holder) => holder?.reportDate)
    .filter(Boolean)
    .map((raw) => ({ raw, time: new Date(raw).getTime() }))
    .filter(({ time }) => Number.isFinite(time))
    .sort((left, right) => right.time - left.time)[0];

  return latest?.raw ?? null;
}

function renderPriceChart(stock) {
  const currency = stock?.currency || 'USD';
  if (state.chartRange === '1D' && stock) {
    const intradayHistory = Array.isArray(stock.intradayHistory) ? stock.intradayHistory : [];
    if (!intradayHistory.length) {
      const messageKey =
        stock.intradayStatus === 'error' || stock.intradayStatus === 'empty'
          ? 'performance.chartUnavailableIntraday'
          : 'performance.chartLoadingIntraday';
      elements.priceChart.innerHTML = `<p class="chart-empty">${escapeHtml(t(messageKey))}</p>`;
      elements.chartRangeLabel.textContent = t('common.awaitingData');
      return;
    }
  }
  const filteredHistory = filterHistoryByRange(selectedChartHistory(stock), state.chartRange);
  const rawPoints = filteredHistory.filter((row) => row && Number.isFinite(Number.parseFloat(row.close)));
  const points = condenseHistoryForChart(rawPoints, chartDisplayLimit(state.chartRange));

  if (points.length < 2) {
    elements.priceChart.innerHTML = `<p class="chart-empty">${escapeHtml(t('performance.chartEmpty'))}</p>`;
    elements.chartRangeLabel.textContent = t('common.awaitingData');
    return;
  }

  const closes = rawPoints.map((row) => Number.parseFloat(row.close));
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const volumes = points.map((row) => numberFrom(row.volume) || 0);
  const maxVolume = Math.max(...volumes, 1);

  const width = 860;
  const height = 320;
  const padTop = 20;
  const padBottom = 20;
  const plotLeft = 20;
  const labelWidth = 72;
  const plotRight = width - labelWidth;
  const plotWidth = Math.max(plotRight - plotLeft, 10);
  const priceHeight = 182;
  const volumeGap = 14;
  const volumeHeight = 54;
  const priceTop = padTop;
  const priceBottom = priceTop + priceHeight;
  const volumeTop = priceBottom + volumeGap;
  const volumeBottom = volumeTop + volumeHeight;
  const xLabelY = height - padBottom + 4;

  const yTicks = 5;
  const tickData = Array.from({ length: yTicks }, (_, idx) => {
    const ratio = idx / (yTicks - 1);
    const value = max - range * ratio;
    const y = priceTop + priceHeight * ratio;
    return { value, y };
  });

  const lineCoordinates = points.map((row, idx) => {
    const x = plotLeft + (idx / (points.length - 1)) * plotWidth;
    const y = priceTop + ((max - Number.parseFloat(row.close)) / range) * priceHeight;
    return { x, y, close: Number.parseFloat(row.close) };
  });
  const linePoints = lineCoordinates.map(({ x, y }) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const areaPath = `M ${plotLeft},${priceBottom} L ${linePoints} L ${plotRight},${priceBottom} Z`;
  const firstDate = formatChartDate(rawPoints[0].date, { month: 'short', day: 'numeric', year: 'numeric' });
  const lastDate = formatChartDate(rawPoints[rawPoints.length - 1].date, { month: 'short', day: 'numeric', year: 'numeric' });
  elements.chartRangeLabel.textContent = hasTimeComponent(rawPoints[rawPoints.length - 1].date)
    ? `${firstDate} - ${lastDate} • ${t('performance.intradayUpdated')}`
    : `${firstDate} - ${lastDate}`;

  const gridLines = tickData
    .map(({ y }) => `<line x1="${plotLeft}" y1="${y.toFixed(2)}" x2="${plotRight}" y2="${y.toFixed(2)}"></line>`)
    .join('');
  const yLabels = tickData
    .map(
      ({ value, y }) =>
        `<text x="${width - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end">${escapeHtml(formatCurrency(value, currency))}</text>`
    )
    .join('');

  const xTicks = 5;
  const xTickData = Array.from({ length: xTicks }, (_, idx) => {
    const ratio = idx / (xTicks - 1);
    const pointIdx = Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1))));
    const x = plotLeft + ratio * plotWidth;
    const dateLabel = formatChartDate(points[pointIdx]?.date, chartTickDateOptions(state.chartRange, points[pointIdx]));
    return { x, dateLabel };
  });
  const xLabels = xTickData
    .map(({ x, dateLabel }) => `<text x="${x.toFixed(2)}" y="${xLabelY.toFixed(2)}" text-anchor="middle">${escapeHtml(dateLabel)}</text>`)
    .join('');

  const barWidth = Math.max(4, plotWidth / points.length - 4);
  const volumeBars = points
    .map((row, idx) => {
      const volume = numberFrom(row.volume) || 0;
      const previousClose = idx > 0 ? numberFrom(points[idx - 1].close) : numberFrom(row.close);
      const currentClose = numberFrom(row.close);
      const x = plotLeft + (idx / (points.length - 1)) * plotWidth - barWidth / 2;
      const barHeight = (volume / maxVolume) * volumeHeight;
      const y = volumeBottom - barHeight;
      const fill = currentClose >= previousClose ? 'rgba(15, 159, 140, 0.36)' : 'rgba(239, 107, 98, 0.34)';
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" fill="${fill}"></rect>`;
    })
    .join('');

  const lastPoint = lineCoordinates[lineCoordinates.length - 1];
  const latestClose = closes[closes.length - 1];

  elements.priceChart.innerHTML = `
    <div class="chart-shell">
      <div class="chart-card">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(t('performance.chartAria'))}">
          <g class="chart-grid">${gridLines}</g>
          <path d="${areaPath}" fill="rgba(37, 99, 235, 0.12)"></path>
          <g class="chart-volume">${volumeBars}</g>
          <polyline fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${linePoints}"></polyline>
          <circle cx="${lastPoint.x.toFixed(2)}" cy="${lastPoint.y.toFixed(2)}" r="5.5" fill="#93c5fd" stroke="#2563eb" stroke-width="2"></circle>
          <line class="chart-axis" x1="${plotLeft}" y1="${priceBottom}" x2="${plotRight}" y2="${priceBottom}"></line>
          <line class="chart-axis" x1="${plotLeft}" y1="${volumeBottom}" x2="${plotRight}" y2="${volumeBottom}"></line>
          <g class="chart-y-labels">${yLabels}</g>
          <g class="chart-x-labels">${xLabels}</g>
        </svg>
      </div>
      <div class="chart-footer">
        <article class="chart-stat">
          <small>${escapeHtml(t('performance.low'))}</small>
          <strong>${formatCurrency(min, currency)}</strong>
        </article>
        <article class="chart-stat">
          <small>${escapeHtml(t('performance.high'))}</small>
          <strong>${formatCurrency(max, currency)}</strong>
        </article>
        <article class="chart-stat">
          <small>${escapeHtml(t('performance.latest'))}</small>
          <strong>${formatCurrency(latestClose, currency)}</strong>
        </article>
      </div>
    </div>
  `;
}

function filterHistoryByRange(history, range) {
  if (!Array.isArray(history) || !history.length) return [];
  if (range === '1D') {
    const latestPoint = history[history.length - 1];
    const latestSession = String(latestPoint?.date || '').slice(0, 10);
    const intradayDay = history.filter((point) => String(point?.date || '').slice(0, 10) === latestSession);
    return intradayDay.length >= 2 ? intradayDay : history.slice(-Math.min(history.length, 78));
  }

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
  if (range === '1D') return null;
  if (range === '1M') return 30;
  if (range === '3M') return 90;
  if (range === '6M') return 180;
  if (range === '1Y') return 365;
  if (range === '2Y') return 365 * 2;
  if (range === '5Y') return 365 * 5;
  if (range === 'MAX') return null;
  return null;
}

function selectedChartHistory(stock) {
  if (!stock || typeof stock !== 'object') return [];
  if (state.chartRange === '1D') {
    return Array.isArray(stock.intradayHistory) ? stock.intradayHistory : [];
  }
  return stock.priceHistory || [];
}

function latestMarketPoint(stock) {
  if (!stock || typeof stock !== 'object') return null;
  const intraday = Array.isArray(stock.intradayHistory) ? stock.intradayHistory : [];
  if (intraday.length) return intraday[intraday.length - 1];
  const daily = Array.isArray(stock.priceHistory) ? stock.priceHistory : [];
  return daily.length ? daily[daily.length - 1] : null;
}

function chartDisplayLimit(range) {
  if (range === '1D') return 240;
  if (range === '2Y') return 280;
  if (range === '5Y') return 320;
  if (range === 'MAX') return 360;
  return 220;
}

function condenseHistoryForChart(history, maxPoints) {
  if (!Array.isArray(history) || history.length <= maxPoints) return history;

  const lastIndex = history.length - 1;
  const sampledIndexes = new Set([0, lastIndex]);
  for (let idx = 1; idx < maxPoints - 1; idx += 1) {
    sampledIndexes.add(Math.round((idx / (maxPoints - 1)) * lastIndex));
  }

  return [...sampledIndexes]
    .sort((a, b) => a - b)
    .map((index) => history[index]);
}

function chartTickDateOptions(range, point) {
  if (range === '1D' && hasTimeComponent(point?.date)) {
    return { hour: 'numeric', minute: '2-digit' };
  }
  if (range === '1Y' || range === '2Y' || range === '5Y' || range === 'MAX') {
    return { month: 'short', year: '2-digit' };
  }
  return { month: 'short', day: 'numeric' };
}

function syncChartRangeButtons(options = {}) {
  let activeButton = null;
  elements.chartRangeButtons.forEach((button) => {
    const isActive = button.dataset.range === state.chartRange;
    button.classList.toggle('active', isActive);
    if (isActive) activeButton = button;
  });
  syncChartRangeThumb(activeButton, options);
}

function syncChartRangeThumb(activeButton = null, options = {}) {
  const thumb = elements.chartRangeThumb;
  const container = elements.chartRangeSwitch;
  const target = activeButton && activeButton instanceof HTMLElement
    ? activeButton
    : Array.from(elements.chartRangeButtons).find((button) => button.classList.contains('active'));
  if (!thumb || !container || !target) return;

  const currentMetrics = readThumbMetrics(thumb, container);
  const targetMetrics = {
    left: target.offsetLeft,
    top: target.offsetTop,
    width: target.offsetWidth,
    height: target.offsetHeight,
  };
  const shouldAnimate = options.animate !== false && currentMetrics;

  if (thumb._thumbMotion) {
    thumb._thumbMotion.cancel();
    thumb._thumbMotion = null;
  }

  if (!shouldAnimate) {
    thumb.classList.remove('is-moving');
    writeThumbMetrics(thumb, targetMetrics);
    return;
  }

  writeThumbMetrics(thumb, currentMetrics);
  animateThumbToTarget(thumb, currentMetrics, targetMetrics);
}

function readThumbMetrics(thumb, container) {
  if (!thumb.dataset.ready) return null;

  const thumbRect = thumb.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  if (!thumbRect.width || !thumbRect.height) return null;

  return {
    left: thumbRect.left - containerRect.left,
    top: thumbRect.top - containerRect.top,
    width: thumbRect.width,
    height: thumbRect.height,
  };
}

function writeThumbMetrics(thumb, metrics) {
  thumb.style.width = `${metrics.width}px`;
  thumb.style.height = `${metrics.height}px`;
  thumb.style.transform = `translate3d(${metrics.left}px, ${metrics.top}px, 0)`;
  thumb.dataset.ready = 'true';
}

function animateThumbToTarget(thumb, currentMetrics, targetMetrics) {
  const travel = Math.abs(targetMetrics.left - currentMetrics.left);
  const stretch = Math.min(28, 10 + travel * 0.18);
  const bridgeLeft = Math.min(currentMetrics.left, targetMetrics.left) - (stretch * 0.2);
  const bridgeRight = Math.max(
    currentMetrics.left + currentMetrics.width,
    targetMetrics.left + targetMetrics.width
  ) + (stretch * 0.2);
  const bridgeWidth = Math.max(bridgeRight - bridgeLeft, Math.max(currentMetrics.width, targetMetrics.width));
  const bridgeHeight = Math.max(currentMetrics.height, targetMetrics.height) + Math.min(3, travel * 0.015);

  thumb.classList.add('is-moving');
  const animation = thumb.animate(
    [
      {
        transform: `translate3d(${currentMetrics.left}px, ${currentMetrics.top}px, 0) scale(1, 1)`,
        width: `${currentMetrics.width}px`,
        height: `${currentMetrics.height}px`,
        borderRadius: '10px',
        offset: 0,
      },
      {
        transform: `translate3d(${bridgeLeft}px, ${targetMetrics.top}px, 0) scale(1.015, 0.985)`,
        width: `${bridgeWidth}px`,
        height: `${bridgeHeight}px`,
        borderRadius: '17px',
        offset: 0.44,
      },
      {
        transform: `translate3d(${targetMetrics.left}px, ${targetMetrics.top}px, 0) scale(0.996, 1.01)`,
        width: `${targetMetrics.width}px`,
        height: `${targetMetrics.height}px`,
        borderRadius: '12px',
        offset: 0.78,
      },
      {
        transform: `translate3d(${targetMetrics.left}px, ${targetMetrics.top}px, 0) scale(1, 1)`,
        width: `${targetMetrics.width}px`,
        height: `${targetMetrics.height}px`,
        borderRadius: '10px',
        offset: 1,
      },
    ],
    {
      duration: 560,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    }
  );

  thumb._thumbMotion = animation;
  animation.onfinish = () => {
    writeThumbMetrics(thumb, targetMetrics);
    thumb.classList.remove('is-moving');
    thumb._thumbMotion = null;
  };
  animation.oncancel = () => {
    thumb.classList.remove('is-moving');
    thumb._thumbMotion = null;
  };

  window.setTimeout(() => {
    if (!thumb._thumbMotion) {
      thumb.classList.remove('is-moving');
    }
  }, 620);
}

function buildSolvencyNote(stock) {
  const currentRatio = numberFrom(stock.currentRatio);
  const debtToEquity = numberFrom(stock.debtToEquity);
  const cashRatio = numberFrom(stock.cashRatio);

  if (currentRatio == null && debtToEquity == null && cashRatio == null) {
    return t('narrative.solvency.incomplete');
  }

  if (currentRatio != null && currentRatio >= 1.5 && debtToEquity != null && debtToEquity <= 1) {
    return t('narrative.solvency.sturdy', {
      currentRatio: formatNumber(currentRatio),
      debtToEquity: formatNumber(debtToEquity),
    });
  }

  if (currentRatio != null && currentRatio < 1) {
    return t('narrative.solvency.tight', {
      currentRatio: formatNumber(currentRatio),
      cashRatio: formatNumber(cashRatio),
    });
  }

  if (debtToEquity != null && debtToEquity > 2) {
    return t('narrative.solvency.elevated', {
      debtToEquity: formatNumber(debtToEquity),
    });
  }

  return t('narrative.solvency.default', {
    currentRatio: formatNumber(currentRatio),
    cashRatio: formatNumber(cashRatio),
    debtToEquity: formatNumber(debtToEquity),
  });
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const question = elements.chatInput.value.trim();
  if (!question) return;
  if (!state.stock) {
    const preconditionMessage = t('assistant.precondition');
    const lastAssistantText = [...elements.chatLog.querySelectorAll('.message.assistant .message-body')]
      .at(-1)
      ?.textContent?.trim();
    if (lastAssistantText !== preconditionMessage) {
      addMessage('assistant', preconditionMessage);
    }
    setStatus(t('assistant.precondition'), true);
    return;
  }

  addMessage('user', question);
  elements.chatInput.value = '';

  addMessage('assistant', t('assistant.loading'));

  try {
    const answer = await fetchAiAnalysis(question, state.stock);
    replaceLastAssistantMessage(answer);
  } catch (error) {
    console.error(error);
    replaceLastAssistantMessage(t('errors.aiFailed', { message: error.message }));
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
      stock: buildAiStockContext(stock),
    }),
  });

  const payload = await readJsonSafe(response);
  if (!response.ok) {
    const detailedMessage = resolveApiErrorMessage(payload, 'errors.aiFailedStatus', { status: response.status });
    throw new Error(detailedMessage);
  }

  return payload?.answer?.trim() || t('assistant.noAnswer');
}

function buildAiStockContext(stock) {
  if (!stock || typeof stock !== 'object') return stock;
  return {
    ...stock,
    priceHistory: Array.isArray(stock.priceHistory) ? stock.priceHistory.slice(-30) : [],
    intradayHistory: Array.isArray(stock.intradayHistory) ? stock.intradayHistory.slice(-24) : [],
  };
}

async function readJsonSafe(response) {
  const raw = await response.text();
  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw || t('errors.nonJson') };
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

function resolveApiErrorMessage(payload, fallbackKey, fallbackParams = {}) {
  if (payload && typeof payload === 'object' && payload.code === 'RATE_LIMITED') {
    const retryAfter = Math.max(5, Math.round(numberFrom(payload.retryAfter) || 20));
    return t('errors.rateLimited', { seconds: retryAfter });
  }
  return extractApiErrorMessage(payload) || t(fallbackKey, fallbackParams);
}

function buildInvestorSignals(stock) {
  const good = [];
  const bad = [];
  let score = 50;

  if (stock.profitMargin != null) {
    if (stock.profitMargin >= 0.15) {
      good.push(t('signals.good.profitMargin', { value: formatPercent(stock.profitMargin) }));
      score += 12;
    } else if (stock.profitMargin < 0.05) {
      bad.push(t('signals.bad.profitMargin', { value: formatPercent(stock.profitMargin) }));
      score -= 12;
    }
  }

  if (stock.returnOnEquity != null) {
    if (stock.returnOnEquity >= 0.15) {
      good.push(t('signals.good.roe', { value: formatPercent(stock.returnOnEquity) }));
      score += 10;
    } else if (stock.returnOnEquity < 0.08) {
      bad.push(t('signals.bad.roe', { value: formatPercent(stock.returnOnEquity) }));
      score -= 10;
    }
  }

  if (stock.currentRatio != null) {
    if (stock.currentRatio >= 1.5) {
      good.push(t('signals.good.currentRatio', { value: formatNumber(stock.currentRatio) }));
      score += 8;
    } else if (stock.currentRatio < 1) {
      bad.push(t('signals.bad.currentRatio', { value: formatNumber(stock.currentRatio) }));
      score -= 8;
    }
  }

  if (stock.debtToEquity != null) {
    if (stock.debtToEquity <= 1) {
      good.push(t('signals.good.debtToEquity', { value: formatNumber(stock.debtToEquity) }));
      score += 10;
    } else if (stock.debtToEquity > 2) {
      bad.push(t('signals.bad.debtToEquity', { value: formatNumber(stock.debtToEquity) }));
      score -= 10;
    }
  }

  if (stock.priceToSales != null && stock.profitMargin != null) {
    if (stock.priceToSales > 10 && stock.profitMargin < 0.1) {
      bad.push(t('signals.bad.priceToSales', { value: formatNumber(stock.priceToSales) }));
      score -= 8;
    } else if (stock.priceToSales < 4 && stock.profitMargin >= 0.12) {
      good.push(t('signals.good.priceToSales', { value: formatNumber(stock.priceToSales) }));
      score += 8;
    }
  }

  const fwdYield = forwardDivYield(stock);
  if (fwdYield != null && fwdYield >= 0.02) {
    good.push(t('signals.good.forwardYield', { value: formatPercent(fwdYield) }));
    score += 4;
  }

  if (!good.length) good.push(t('signals.good.fallback'));
  if (!bad.length) bad.push(t('signals.bad.fallback'));

  score = Math.max(0, Math.min(100, score));
  return { good, bad, score };
}

function renderSignalLists(goodSignals, badSignals) {
  elements.goodSignals.innerHTML = goodSignals.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  elements.badSignals.innerHTML = badSignals.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderSignalSummary(score) {
  if (score == null) {
    elements.signalScore.textContent = t('signals.score', { score: '--' });
    elements.signalVerdict.textContent = t('signals.emptyVerdict');
    elements.signalProgressFill.style.width = '0%';
    elements.signalProgressFill.style.background = 'linear-gradient(90deg, #60a5fa, #2563eb)';
    return;
  }

  elements.signalScore.textContent = t('signals.score', { score: Math.round(score) });
  let verdict = t('signals.verdict.mixed');
  let gradient = 'linear-gradient(90deg, #60a5fa, #2563eb)';
  if (score >= 75) {
    verdict = t('signals.verdict.strong');
    gradient = 'linear-gradient(90deg, #34d399, #0f9f8c)';
  } else if (score <= 40) {
    verdict = t('signals.verdict.risk');
    gradient = 'linear-gradient(90deg, #fda4af, #ef4444)';
  }
  elements.signalVerdict.textContent = verdict;
  elements.signalProgressFill.style.width = `${Math.round(score)}%`;
  elements.signalProgressFill.style.background = gradient;
}

function addMessage(role, text) {
  const message = buildMessageElement(role, text);
  elements.chatLog.appendChild(message);
  elements.chatLog.scrollTop = elements.chatLog.scrollHeight;
}

function resetAssistantConversation(messages = [t('assistant.initialMessage')]) {
  elements.chatLog.innerHTML = '';
  messages.filter(Boolean).forEach((message) => addMessage('assistant', message));
  elements.chatInput.value = '';
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

function buildMessageElement(role, text, timestamp = new Date()) {
  const message = document.createElement('article');
  message.className = `message ${role}`;

  const card = document.createElement('div');
  card.className = 'message-card';
  if (role === 'assistant') {
    const badge = document.createElement('div');
    badge.className = 'message-badge';
    card.appendChild(badge);
  }

  const body = document.createElement('div');
  body.className = 'message-body';
  card.appendChild(body);

  const time = document.createElement('time');
  time.className = 'message-time';

  message.append(card, time);
  setMessageContent(message, role, text, { timestamp });
  return message;
}

function setMessageContent(target, role, text, { timestamp = new Date() } = {}) {
  const safeText = typeof text === 'string' ? text : String(text ?? '');
  const body = target.querySelector('.message-body');
  const time = target.querySelector('.message-time');
  const badge = target.querySelector('.message-badge');
  const resolvedTimestamp = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const safeTimestamp = Number.isNaN(resolvedTimestamp.getTime()) ? new Date() : resolvedTimestamp;

  if (!body || !time) return;

  target.className = `message ${role}`;
  time.dateTime = safeTimestamp.toISOString();
  time.textContent = formatChatTimestamp(safeTimestamp);

  if (role !== 'assistant') {
    body.innerHTML = escapeHtml(safeText).replace(/\r?\n/g, '<br>');
    return;
  }

  if (badge) {
    const badgeKey = resolveAssistantBadgeKey(safeText);
    badge.textContent = t(badgeKey);
    target.dataset.variant = badgeKey;
  }

  body.innerHTML = formatAssistantText(safeText);
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
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle('error', isError);
}

function cardTemplate([label, value]) {
  return `<article class="stat-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`;
}

function numberFrom(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function forwardDivYield(stock) {
  if (!stock || typeof stock !== 'object') return null;
  const v = stock.forwardDividendYield ?? stock.dividendYield;
  return v == null ? null : Number(v);
}

function formatCurrency(value, currency = 'USD') {
  if (value == null) return t('common.na');
  try {
    return new Intl.NumberFormat(currentIntlLocale(), { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return `${formatNumber(value)} ${currency || ''}`.trim();
  }
}

function formatCompactCurrency(value, currency = 'USD') {
  if (value == null) return t('common.na');
  try {
    return new Intl.NumberFormat(currentIntlLocale(), {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${formatCompactNumber(value)} ${currency || ''}`.trim();
  }
}

function formatNumber(value) {
  if (value == null) return t('common.na');
  return new Intl.NumberFormat(currentIntlLocale(), { maximumFractionDigits: 2 }).format(value);
}

function formatCompactNumber(value) {
  if (value == null) return t('common.na');
  return new Intl.NumberFormat(currentIntlLocale(), { notation: 'compact', maximumFractionDigits: 2 }).format(value);
}

function formatInteger(value) {
  if (value == null) return t('common.na');
  return new Intl.NumberFormat(currentIntlLocale(), { maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value) {
  if (value == null) return t('common.na');
  return `${(value * 100).toFixed(2)}%`;
}

function formatSignedCurrency(value, currency = 'USD') {
  if (value == null) return t('common.na');
  const absolute = formatCurrency(Math.abs(value), currency);
  return `${value >= 0 ? '+' : '-'}${absolute}`;
}

function formatChartDate(raw, options = { month: 'short', day: 'numeric' }) {
  if (!raw) return t('common.na');
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);
  if ('hour' in options || 'minute' in options) {
    return date.toLocaleTimeString(currentIntlLocale(), options);
  }
  return date.toLocaleDateString(currentIntlLocale(), options);
}

function formatAsOfLabel(raw) {
  if (!raw) return t('common.na');
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);
  const options = hasTimeComponent(raw)
    ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleString(currentIntlLocale(), options);
}

function hasTimeComponent(raw) {
  return typeof raw === 'string' && raw.includes('T');
}

function formatReportedDate(raw) {
  if (!raw) return t('common.na');
  return formatChartDate(raw, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFiscalDate(raw) {
  if (!raw) return t('common.na');
  if (typeof raw === 'number') {
    return formatChartDate(raw * 1000, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return formatChartDate(raw, { month: 'short', day: 'numeric', year: 'numeric' });
}

function firstSentence(text) {
  if (!text) return '';
  const cleaned = String(text).replace(/\s+/g, ' ').trim();
  const match = cleaned.match(/(.+?[.!?])(?:\s|$)/);
  return match?.[1] || cleaned;
}
