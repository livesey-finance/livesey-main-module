<template>
  <div class="portfolio-container" @contextmenu="openConsole">
    <header>
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <nav>
        <a href="/">Home</a>
        <a href="#">Shares</a>
        <a href="#">Crypto</a>
        <a href="#">Portfolio</a>
        <a href="#">Calculator</a>
        <a href="#">About</a>
      </nav>
    </header>
    <div class="content">
      <div class="chart-container">
        <canvas id="portfolioChart"></canvas>
      </div>
      <div class="info-container">
        <h2>Your portfolio:</h2>
        <p>
          Yields, in 
          <span @click="toggleCurrencyList" class="currency">{{ currency }}</span>
          <ul v-show="showCurrencyList" class="currency-list">
            <li v-for="curr in currencies" :key="curr" @click="selectCurrency(curr)">{{ curr }}</li>
          </ul>
        </p>
        <div class="yields">
          <div v-for="(value, key) in yields" :key="key" class="yield">
            <p>{{ key }}</p>
            <p>{{ value }}</p>
          </div>
        </div>
        <p>Total price: {{ totalPrice }} {{ currency }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'PortfolioPage',
  data() {
    return {
      currency: 'USD',
      showCurrencyList: false,
      currencies: ['USD', 'UAH', 'PLN', 'EUR'],
      yields: {
        'Expected annual profitability': 'N/A',
        'Sharpe ratio': 'N/A',
        'Sortino ratio': 'N/A',
        'Inflation for the year': 'N/A',
        'Actual yield[%]': 'N/A',
        'Actual yield[USD]': 'N/A',
        'Fixed price maximum (last year)': 'N/A',
        'Fixed price minimum (last year)': 'N/A',
      },
      totalPrice: 'N/A',
      chart: null,
      portfolioData: {
        labels: ['NKE', 'BTC', 'AAPL', 'USDT'],
        datasets: [{
          data: [18, 20, 30, 18],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384']
        }]
      }
    };
  },
  methods: {
    fetchPortfolioData() {
      // Fetch the data from the backend and update the yields and totalPrice.
      // This is a mock implementation. Replace it with actual backend call.
      setTimeout(() => {
        this.yields = {
          'Expected annual profitability': '5%',
          'Sharpe ratio': '1.5',
          'Sortino ratio': '1.8',
          'Inflation for the year': '2%',
          'Actual yield[%]': '6%',
          'Actual yield[USD]': '600',
          'Fixed price maximum (last year)': '1000',
          'Fixed price minimum (last year)': '800',
        };
        this.totalPrice = '2000';
        console.log('Data fetched', this.yields, this.totalPrice);
      }, 1000);
    },
    toggleCurrencyList() {
      this.showCurrencyList = !this.showCurrencyList;
    },
    selectCurrency(currency) {
      this.currency = currency;
      this.showCurrencyList = false;
    },
    openConsole(event) {
      event.preventDefault();
      if (window && window.console) {
        console.log("Console opened on right-click");
      }
      // Allow the default context menu
      setTimeout(() => {
        document.body.oncontextmenu = null;
      }, 0);
    },
    updateChart() {
      if (this.chart) {
        this.chart.destroy();
      }
      const ctx = document.getElementById('portfolioChart').getContext('2d');
      console.log('Chart context:', ctx);
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: this.portfolioData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      });
      console.log('Chart initialized:', this.chart);
    }
  },
  mounted() {
    this.fetchPortfolioData();
    this.updateChart();
  },
  watch: {
    portfolioData: {
      handler() {
        this.updateChart();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
.portfolio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #000;
  height: 100%;
  overflow: hidden;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: #f6f4f0;
}
.logo {
  height: 40px;
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  color: #000;
  text-decoration: none;
}
.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  padding: 20px;
  width: 100%;
  overflow: hidden;
}
.chart-container {
  flex: 1;
  min-width: 400px;
  height: 400px;
}
.info-container {
  flex: 1;
  margin-left: 50px;
}
.yields {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.yield {
  flex: 1 1 200px;
}
.currency {
  cursor: pointer;
  text-decoration: underline;
}
.currency-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #f6f4f0;
  border: 1px solid #ccc;
  position: absolute;
}
.currency-list li {
  padding: 5px 10px;
  cursor: pointer;
}
.currency-list li:hover {
  background-color: #ccc;
}

@media (max-width: 768px) {
  nav {
    display: none;
  }
  header {
    flex-direction: column;
  }
  .info-container {
    margin-left: 0;
  }
  .content {
    flex-direction: column;
    align-items: center;
  }
  .chart-container, .info-container {
    min-width: 100%;
    height: auto;
  }
}
</style>
