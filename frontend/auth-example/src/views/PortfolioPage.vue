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
        <a @click="openLogin">Sign In</a>
        <a @click="openSignup">Sign Up</a>
      </nav>
    </header>
    <div class="content">
      <div class="chart-container">
        <canvas id="portfolioChart"></canvas>
      </div>
      <div class="info-container">
        <h2>Your portfolio:</h2>
        <p class="yields-title">
          Yields, in 
          <span @click="toggleCurrencyList" class="currency">{{ currency }}</span>
          <ul v-show="showCurrencyList" class="currency-list">
            <li v-for="curr in currencies" :key="curr" @click="selectCurrency(curr)">{{ curr }}</li>
          </ul>
        </p>
        <div class="yields">
          <div v-for="(value, key) in yields" :key="key" class="yield">
            <p class="yield-key">{{ key }}</p>
            <p class="yield-value">{{ value }}</p>
          </div>
        </div>
        <div class="yield-total">
        <p>Total price: <span class="yield-value">{{ totalPrice }}</span> <span class="yield-value">{{ currency }}</span></p>
        </div>
      </div>
    </div>
    <footer>
      <div class="footer-content">
        <div class="footer-left">
          <a href="#" class="footer-logo">Livesey</a>
          <div class="footer-social">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Email</a>
          </div>
        </div>
        <div class="footer-right">
          <a href="#">About Us</a>
          <a href="#">Terms of Service</a>
          <a href="#">Editorial Policy</a>
          <a href="#">Advertise</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </footer>

    <!-- Login Modal -->
    <div v-if="showLogin" class="modal" @click.self="closeModal">
      <LoginPage @close="closeModal" @switchToSignup="openSignup" />
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal" @click.self="closeModal">
      <SignupPage @close="closeModal" @switchToLogin="openLogin" />
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  name: 'PortfolioPage',
  components: {
    LoginPage,
    SignupPage
  },
  data() {
    return {
      currency: 'USD',
      showCurrencyList: false,
      currencies: ['USD', 'UAH', 'PLN', 'EUR'],
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
      chart: null,
      portfolioData: {
        labels: ['NKE', 'BTC', 'AAPL', 'USDT'],
        datasets: [{
          data: [18, 20, 30, 18],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF6384']
        }]
      },
      showLogin: false,
      showSignup: false
    };
  },
  methods: {
    fetchPortfolioData() {
      setTimeout(() => {
        this.yields = {
          'Expected annual profitability:': '5%',
          'Sharpe ratio:': '1.5',
          'Sortino ratio:': '1.8',
          'Inflation for the year:': '2%',
          'Actual yield [%]:': '6%',
          'Actual yield [USD]:': '600',
          'Fixed price maximum [last year]:': '1000',
          'Fixed price minimum [last year]:': '800',
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
        console.log("Console opened on right-click", event);
    },
    handleChartClick(event) {
      const activePoints = this.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      if (activePoints.length > 0) {
        const firstPoint = activePoints[0];
        const label = this.chart.data.labels[firstPoint.index];
        const url = label === 'BTC' || label === 'USDT' ? `/crypto/${label}` : `/shares/${label}`;

        this.$router.push(url);
      }
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
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 25
                }
              }
            }
          },
          onClick: this.handleChartClick
        }
      });
      console.log('Chart initialized:', this.chart);
    },
    openLogin() {
      this.showLogin = true;
      this.showSignup = false;
    },
    openSignup() {
      this.showSignup = true;
      this.showLogin = false;
    },
    closeModal() {
      this.showLogin = false;
      this.showSignup = false;
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
  margin-left: 30px;
  height: 60px;
}
nav {
  display: flex;
  gap: 30px;
  margin-right: 100px;
  font-size: 22px;
}
nav a {
  color: #4f4f4f;
  text-decoration: none;
  cursor: pointer;
}
.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.chart-container {
  position: fixed;
  top: 180px; 
  left: 80px;
  min-width: 600px;
  height: 600px;
}
.info-container {
  flex: 1;
  margin-left: 900px; 
  color: #4f4f4f;
  font-size: 30px;
}
.yields-title {
  display: flex;
  align-items: center;
  margin-left: 80px;
  margin-bottom: 20px;
  font-size: 30px;
}
.yields {
  display: flex;
  margin-left: 80px;
  flex-direction: column;
  gap: 20px;
}
.yield {
  display: flex;
  justify-content: space-between;
  text-align: left;
  width: 100%;
}
.yield-key {
  flex-basis: 60%;
  font-size: 24px;
  font-weight: bold;
}
.yield-value {
  flex-basis: 50%;
  margin-top: 30px;
  font-size: 20px;
  font-weight: normal;
}
.yield-total{
  font-size: 32px;
  margin-left: 80px;
  font-weight: bold;
}
.yield-total-value{
  font-size: 32px;

}
.currency {
  cursor: pointer;
  text-decoration: underline;
  margin-left: 5px;
}
.currency-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #f6f4f0;
  border: 1px solid #ccc;
  position: absolute;
  z-index: 1000;
  font-size: 18px;
}
.currency-list li {
  padding: 5px 10px;
  cursor: pointer;
}
.currency-list li:hover {
  background-color: #ddd;
}
footer {
  width: 100%;
  background-color: #f6f4f0;
  padding: 20px;
  box-sizing: border-box;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.footer-logo {
  color: #4f4f4f;
  text-decoration: none;
  font-size: 20px;
}
.footer-social {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}
.footer-right {
  display: flex;
  gap: 20px;
  font-size: 16px;
}
.footer-right a {
  color: #4f4f4f;
  text-decoration: none;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>