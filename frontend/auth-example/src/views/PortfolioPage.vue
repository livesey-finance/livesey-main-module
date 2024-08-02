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
      <div class="chart-container" @contextmenu="openContextMenu">
      <canvas id="portfolioChart"></canvas>
      <div v-if="showContextMenu" :style="contextMenuStyle" class="context-menu">
        <ul>
          <li @click="deleteItem">Delete</li>
          <li @click="changeQuantity">Change Quantity</li>
        </ul>
      </div>
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
      <LoginPage @close="closeModal" @switchToSignup="openSignup" @login="handleLogin" />
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal" @click.self="closeModal">
      <SignupPage @close="closeModal" @switchToLogin="openLogin" @signup="handleSignup" />
    </div>
  </div>
</template>

<script>
import { mockPortfolioData } from '@/mocks/portfolioMock';
import Chart from 'chart.js/auto';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import axios from 'axios';

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
      yields: mockPortfolioData.yields,
      totalPrice: mockPortfolioData.totalPrice,
      portfolioData: mockPortfolioData.portfolioData,
      chart: null,
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
      user: null,
      searchQuery: '',
      suggestions: [],
      darkTheme: false
    };
  },
  computed: {
    userIcon() {
      return this.user?.avatar || require('@/assets/default-user.png');
    }
  },
  methods: {
    fetchPortfolioData() {
      setTimeout(() => {
        this.yields = mockPortfolioData.yields;
        this.totalPrice = mockPortfolioData.totalPrice;
        this.portfolioData = mockPortfolioData.portfolioData;
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
      const legendColor = this.darkTheme ? '#c9d1d9' : '#000000';

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
                color: legendColor
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
        this.logAction('Fetched Suggestions');
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [{ name: 'No matchings were found', code: '' }];
        this.logAction('Error Fetching Suggestions', { error });
      }
    },
    selectSuggestion(item) {
      if (item.code) {
        this.$router.push(`/shares/${item.code}`);
      }
      this.suggestions = [];
      this.searchQuery = '';
      this.logAction('Selected Suggestion', item);
    },
    openLogin() {
      this.showLogin = true;
      this.showSignup = false;
      this.logAction('Opened Login Modal');
    },
    openSignup() {
      this.showSignup = true;
      this.showLogin = false;
      this.logAction('Opened Signup Modal');
    },
    closeModal() {
      this.showLogin = false;
      this.showSignup = false;
      this.logAction('Closed Modal');
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
      this.logAction('Toggled Profile Menu');
    },
    viewProfile() {
      console.log('Viewing profile');
      this.logAction('Viewing Profile');
    },
    handleLogin(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.showLogin = false;
      this.logAction('User Logged In');
    },
    handleSignup(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.showSignup = false;
      this.logAction('User Signed Up');
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.showProfileMenu = false;
      localStorage.removeItem('user');
      this.logAction('User Logged Out');
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
      this.updateChart();
      this.logAction('Toggled Theme', { darkTheme: this.darkTheme });
    },
    logAction(action, details = {}) {
      const logEntry = {
        action,
        details,
        timestamp: new Date().toISOString(),
        user: this.user ? this.user.email : 'Guest'
      };
      console.log('Log Entry:', logEntry);
    }
  },
  mounted() {
    this.fetchPortfolioData();
    this.updateChart();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.darkTheme = false;
      document.body.classList.remove('dark-theme');
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
        this.isLoggedIn = true;
        this.logAction('Restored User Session');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  },
  
  watch: {
    darkTheme() {
      this.updateChart();
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
  color: #383838;
  height: 100%;
  overflow: hidden;
  font-family: Arial, sans-serif;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #EBEBEC;
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
  color: #383838;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
}

nav a:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
  transition: 0.2s;
}

nav a.active {
  background-color: #383838;
  color: #EBEBEC;
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
  width: 150px; /* Adjust width to ensure text fits in one line */
}

.profile-menu a {
  display: block;
  padding: 10px 20px; /* Reduced padding to allow more space for text */
  color: #383838;
  text-decoration: none;
  white-space: nowrap; /* Prevents text from wrapping */
}

.profile-menu a:hover {
  background-color: #EBEBEC;
  color: #383838;
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
  color: #383838;
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
  background-color: #EBEBEC;
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
  background-color: #383838;
  color: #EBEBEC;
  padding: 20px;
  box-sizing: border-box;
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
  color: #FBF9FB;
  text-decoration: none;
  font-size: 20px;
}

.footer-logo:hover {
  color: #84847C;
}

.footer-social {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.footer-social a {
  color: #FBF9FB;
  text-decoration: none;
}

.footer-social a:hover {
  color: #84847C;
}

.footer-right {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.footer-right a {
  color: #FBF9FB;
  text-decoration: none;
  margin-right: 15px;
}

.footer-right a:hover {
  color: #84847C;
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
