// src/mocks/portfolioListVue.js

const portfolios = [
    {
      name: "My First Portfolio",
      username: "my-first-portfolio",
      description: "A description of my first portfolio.",
    },
    {
      name: "Tech Giants",
      username: "tech-giants",
      description: "Investment in major tech companies.",
    },
    // More mock portfolios can be added here
  ];
  
  // Simulate a backend username check
  const checkPortfolioUsername = async (username) => {
    const exists = portfolios.some((portfolio) => portfolio.username === username);
    return { exists };
  };
  
  // Simulate fetching portfolios from the backend
  const getPortfolios = async () => {
    return portfolios;
  };
  
  // Simulate adding a new portfolio to the backend
  const addPortfolio = async (newPortfolio) => {
    portfolios.push(newPortfolio);
    return newPortfolio;
  };
  
  // Simulate updating a portfolio in the backend
  const updatePortfolio = async (username, updatedData) => {
    const index = portfolios.findIndex((portfolio) => portfolio.username === username);
    if (index !== -1) {
      portfolios[index] = { ...portfolios[index], ...updatedData };
      return portfolios[index];
    } else {
      throw new Error('Portfolio not found');
    }
  };
  
  // Simulate deleting a portfolio from the backend
  const deletePortfolio = async (username) => {
    const index = portfolios.findIndex((portfolio) => portfolio.username === username);
    if (index !== -1) {
      portfolios.splice(index, 1);
      return { success: true };
    } else {
      throw new Error('Portfolio not found');
    }
  };
  
  export { portfolios, checkPortfolioUsername, getPortfolios, addPortfolio, updatePortfolio, deletePortfolio };
  