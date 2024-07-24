<template>
  <div class="portfolio-container" @contextmenu="openConsole">
    <header>
      <img :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" alt="Logo" class="logo" />
      <div class="search-container">
        <input type="text" v-model="searchQuery" @input="fetchSuggestions" placeholder="Search stocks and crypto..." />
        <ul v-if="searchQuery.length > 0" class="suggestions">
          <li v-if="suggestions.length === 0">no matchings were found</li>
          <li v-else v-for="item in suggestions.slice(0, 5)" :key="item.code" @click="selectSuggestion(item)">
            {{ item.name }} ({{ item.code }})
          </li>
        </ul>
      </div>
      <nav>
        <a href="/">Home</a>
        <a href="/shares">Shares</a>
        <a href="/crypto">Crypto</a>
        <a href="/portfolio" class="active">Portfolio</a>
        <a href="/calculator">Calculator</a>
        <a href="/about">About</a>
        <a v-if="!isLoggedIn" @click="openLogin">Sign In</a>
        <a v-if="!isLoggedIn" @click="openSignup">Sign Up</a>
        <div v-if="isLoggedIn" class="user-profile">
          <img :src="userIcon" alt="User Icon" @click="toggleProfileMenu" />
          <div v-if="showProfileMenu" class="profile-menu">
            <a @click="viewProfile">Profile</a>
            <a @click="logout">Log Out</a>
          </div>
        </div>
        <div class="theme-toggle">
        <input type="checkbox" id="theme-switch" @change="toggleTheme" :checked="darkTheme">
        <label for="theme-switch" class="slider"></label>
      </div>
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
      <LoginPage @close="closeModal" @switchToSignup="openSignup" @login="login" />
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal" @click.self="closeModal">
      <SignupPage @close="closeModal" @switchToLogin="openLogin" />
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from 'axios';
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
    lightThemeColors: [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FFCD56', '#FF6384', '#36A2EB', '#FFCE56',
      '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#FF6384',
      '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#FFCD56', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FFCD56', '#FF6384', '#36A2EB',
      '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56',
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#FFCD56', '#FF6384', '#36A2EB', '#FFCE56',
      '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#FF6384'
    ],
    darkThemeColors: [
      '#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f',
      '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1',
      '#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f',
      '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1',
      '#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f',
      '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1',
      '#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f',
      '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1',
      '#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f',
      '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'
    ],
    showLogin: false,
    showSignup: false,
    isLoggedIn: false,
    showProfileMenu: false,
    userIcon: require('@/assets/default-user.png'), // Replace with actual user icon path
    searchQuery: '',
    suggestions: [],
    darkTheme: false // Add darkTheme state
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
      const legendColor = this.darkTheme ? '#c9d1d9' : '#000000'; // Use the desired color for the dark theme

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
                },
                color: legendColor // Set the legend label color dynamically
              }
            }
          },
          onClick: this.handleChartClick
        }
      });
    },
    async fetchSuggestions() {
      try {
        const response = await axios.get(`/api/search`, { params: { query: this.searchQuery } });
        this.suggestions = response.data || [];
        if (this.suggestions.length === 0) {
          this.suggestions = [{ name: 'No matchings were found', code: '' }];
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [{ name: 'No matchings were found', code: '' }];
      }
    },
    selectSuggestion(item) {
      if (item.code) {
        this.$router.push(`/shares/${item.code}`);
      }
      this.suggestions = [];
      this.searchQuery = '';
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
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    viewProfile() {
      // Navigate to profile page or show profile details
      console.log('Viewing profile');
    },
    logout() {
      this.isLoggedIn = false;
      this.showProfileMenu = false;
      // Perform any additional logout operations, like clearing tokens
    },
    login() {
      this.isLoggedIn = true;
      this.showLogin = false;
    },
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
      if (this.darkTheme) {
        localStorage.setItem('theme', 'dark');
        document.body.classList.add('dark-theme');
      } else {
        localStorage.setItem('theme', 'light');
        document.body.classList.remove('dark-theme');
      }
      this.updateChart(); // Update chart when theme changes
    }
  },
  mounted() {
    this.fetchPortfolioData();
    this.updateChart();
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.darkTheme = false;
      document.body.classList.remove('dark-theme');
    }
  },
  watch: {
    darkTheme() {
      this.updateChart(); // Update the chart when the theme changes
    },
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
* {
  box-sizing: border-box;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden; /* Hide horizontal overflow */
}
.portfolio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #000;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f6f4f0;
  width: 100%;
  box-sizing: border-box;
}
.logo {
  margin-left: 30px;
  height: 60px;
  max-width: 100%;
}
nav {
  display: flex;
  gap: 30px;
  margin-right: 100px;
  font-size: 22px;
}
nav a {
  color: #000;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
}
nav a:hover {
  background-color: #fff;
  transition: 0.2s;
}
nav a.active {
  background-color: #333;
  color: #fff;
  transition: 0.2s;
}

.user-profile {
  position: relative;
  cursor: pointer;
}

.user-profile img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
}

.profile-menu a {
  display: block;
  padding: 10px 20px;
  color: #333;
  text-decoration: none;
}

.profile-menu a:hover {
  background-color: #f6f4f0;
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

.search-container {
  display: flex; /* Використовуємо flex для правильного вирівнювання */
  align-items: center; /* Вирівнюємо по центру вертикально */
  margin-left: 20px;
  flex-grow: 1; /* Дозволяємо контейнеру займати весь доступний простір */
  max-width: 400px; /* Максимальна ширина для кращого вигляду на великих екранах */
  position: relative; /* Позиціювання для suggestions */
}

.search-container input {
  padding: 10px;
  font-size: 16px;
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 1000;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
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
  background-color: #333;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  color: #fff;
  text-decoration: none;
  font-size: 20px;
}

.footer-social {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.footer-social a {
  color: #fff;
  text-decoration: none;
}

.footer-right {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.footer-right a {
  color: #fff;
  text-decoration: none;
  margin-right: 15px;
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

/* Dark Theme Styles */

.dark-theme {
  background-color: #0d1117;
  color: #c9d1d9;
}

.dark-theme header {
  background-color: #21252d;
}


.dark-theme nav a {
  color: #c9d1d9;
}

.dark-theme nav a:hover {
  background-color: #134B70;
}

.dark-theme nav a.active {
  background-color: #2F4172;
  color: #ffffff;
}

.dark-theme .content {
  background-color: #161b22;
}

.dark-theme footer {
  background-color: #1e1e1e;
}

.dark-theme .footer-logo, .dark-theme .footer-social a, .dark-theme .footer-right a {
  color: #c9d1d9;
}

.dark-theme .profile-menu {
  background-color: #21262d;
}

.dark-theme .search-container input {
  background-color: #161b22;
  color: #c9d1d9;
  border-color: #30363d;
}

.dark-theme .suggestions {
  background-color: #161b22;
  border-color: #30363d;
}

.dark-theme .suggestions li {
  color: #c9d1d9;
}

.dark-theme .suggestions li:hover {
  background-color: #21262d;
}


.dark-theme h2 {
  color: #c9d1d9;
}

.dark-theme .yields-title, .dark-theme .yield-key, .dark-theme .yield-value, .dark-theme .yield-total {
  color: #c9d1d9;
}

.dark-theme .currency-list {
  background-color: #21262d;
  border-color: #30363d;
  color: #c9d1d9;
}

.dark-theme .currency-list li:hover {
  background-color: #30363d;
}

.dark-theme .chart-container {
  background-color: #161b22;
  color: #c9d1d9;
}

.theme-toggle {
  margin-left: 20px;
  margin-top: 15px;
  position: relative;
  display: inline-block;
  width: 35px;
  height: 14px;
}

.theme-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: -3px;
  bottom: -2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(20px);
}
</style>
