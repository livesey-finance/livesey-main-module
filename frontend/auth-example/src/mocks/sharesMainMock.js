// src/sharesMainMock.js
export const mockSharesData = {
    price: [
      { name: 'Apple Inc.', code: 'AAPL', last: 150.25, high: 152.30, low: 149.80, change: 0.45, changePercent: 0.30, volume: 7000000 },
      { name: 'Tesla, Inc.', code: 'TSLA', last: 720.00, high: 725.50, low: 715.00, change: -5.00, changePercent: -0.69, volume: 15000000 },
      // Add more mock stocks as needed
    ],
    fundamental: [
      { name: 'Apple Inc.', code: 'AAPL', marketCap: '2.41T', revenue: '274.52B', peRatio: 35.55, eps: 4.50, beta: 1.2 },
      { name: 'Tesla, Inc.', code: 'TSLA', marketCap: '720.00B', revenue: '31.54B', peRatio: 74.50, eps: 1.50, beta: 1.6 },
      // Add more mock stocks as needed
    ],
    gainers: [
      { code: 'AAPL', last: 150.25, changePercent: 0.30 },
      // Add more gainers as needed
    ],
    losers: [
      { code: 'TSLA', last: 720.00, changePercent: -0.69 },
      // Add more losers as needed
    ],
  };
  