// src/mocks/mockData.js
export const mockData = {
  companyDetails: {
    name: 'Vue.js Corp.',
    code: 'VUE',
    logoSrc: 'vue-logo.png',
  },
  cryptoMetrics: {
    debtRatios: [
      { name: 'Debt-to-Equity Ratio', value: '0.5' },
      { name: 'Long-term Debt to Equity Ratio', value: '0.3' },
    ],
    efficiencyRatios: [
      { name: 'Earnings Per Share', value: '5.00' },
      { name: 'Return on Assets', value: '10%' },
      { name: 'Return on Equity', value: '15%' },
      { name: 'Return on Investment', value: '12%' },
    ],
    liquidityRatios: [
      { name: 'Current Ratio', value: '2.0' },
      { name: 'Quick Ratio', value: '1.5' },
      { name: 'Cash Ratio', value: '1.2' },
      { name: 'Net Working Capital to Revenue', value: '20%' },
      { name: 'Net Debt', value: '-100M' },
    ],
    valuationRatios: [
      { name: 'Price-to-Earnings', value: '25' },
      { name: 'Forward Price-to-Earnings', value: '22' },
      { name: 'Price-to-Earnings-to-Growth', value: '1.5' },
      { name: 'Price-to-Sales', value: '5' },
      { name: 'Price-to-Book', value: '3' },
      { name: 'Price-to-Cash Flow', value: '10' },
      { name: 'Price to Free Cash Flow', value: '12' },
      { name: 'CAPE Ratio', value: '30' },
    ],
    otherRatios: [
      { name: 'Enterprise Value', value: '500B' },
      { name: 'EV to EBITDA', value: '20' },
      { name: 'EV to Cash Flow from Operations', value: '18' },
      { name: 'EV to Free Cash Flow to Firm', value: '15' },
    ],
  },
  searchSuggestions: [
    { name: 'Bitcoin', code: 'BTC' },
    { name: 'Ethereum', code: 'ETH' },
    { name: 'Litecoin', code: 'LTC' },
  ],
};
