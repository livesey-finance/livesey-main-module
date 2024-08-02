export const mockCryptoData = {
    companyDetails: {
      name: 'Bitcoin',
      code: 'BTC',
      logoSrc: 'bitcoin-logo.png',
      category: "stock"
    },
    generalMetrics: [
      { name: 'Market Cap', value: '1T' },
      { name: 'Circulating Supply', value: '19M BTC' },
    ],
    ratios: [
      { name: 'P/E Ratio', value: 'N/A', estimation: 'not-estimated', normalValue: 'N/A' },
      { name: 'Volatility Index', value: '0.45', estimation: 'high', normalValue: '< 0.4' },
    ],
    networkMetrics: [
      { name: 'Node Count', value: '10,000' },
      { name: 'Transaction Rate', value: '5 TPS' },
    ],
    socialMetrics: [
      { name: 'Twitter Followers', value: '10M' },
      { name: 'Reddit Subscribers', value: '2M' },
    ],
    liquidityMetrics: [
      { name: 'Liquidity Ratio', value: '1.2' },
      { name: 'Average Daily Volume', value: '3B USD' },
    ],
    otherMetrics: [
      { name: 'Founding Year', value: '2009' },
      { name: 'Number of Forks', value: '100+' },
    ],
  };
  