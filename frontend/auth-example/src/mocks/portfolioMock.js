export const mockPortfolioData = {
  yields: {
    'Expected annual profitability:': '5%',
    'Sharpe ratio:': '1.5',
    'Sortino ratio:': '1.8',
    'Inflation for the year:': '2%',
    'Actual yield [%]:': '6%',
    'Actual yield [USD]:': '600',
    'Fixed price maximum [last year]:': '1000',
    'Fixed price minimum [last year]:': '800',
  },
  totalPrice: '2000',
  portfolioData: {
    labels: ['NKE', 'BTC', 'AAPL', 'USDT'],
    datasets: [{
      data: [18, 20, 30, 18],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384']
    }]
  }
};
