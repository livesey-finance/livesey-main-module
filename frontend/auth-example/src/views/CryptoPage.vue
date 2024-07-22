<template>
  <div class="shares-page" @contextmenu="openConsole">
    <header>
      <img :src="logoSrc" alt="Logo" class="logo" />
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
        <a href="/shares" class="active">Shares</a>
        <a href="/crypto">Crypto</a>
        <a href="/portfolio">Portfolio</a>
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
      </nav>
    </header>
    <div class="content">
      <div class="company-info">
        <img :src="companyLogoSrc" alt="Company Logo" class="company-logo" />
        <div class="company-details">
          <h1>{{ companyName }}</h1>
          <h2>{{ companyCode }}</h2>
        </div>
        <button @click="togglePortfolio" :class="['portfolio-btn', { 'remove-btn': isInPortfolio }]">
          {{ isInPortfolio ? '- Remove from portfolio' : '+ Add to portfolio' }}
        </button>
      </div>
      <div class="ratios-container">
        <div class="tabs">
          <button @click="activeTab = 'general'" :class="{ active: activeTab === 'general' }">General Metrics</button>
          <button @click="activeTab = 'ratios'" :class="{ active: activeTab === 'ratios' }">Ratios & Analytics</button>
          <button @click="activeTab = 'network'" :class="{ active: activeTab === 'network' }">Network Metrics</button>
          <button @click="activeTab = 'social'" :class="{ active: activeTab === 'social' }">Social Activity</button>
          <button @click="activeTab = 'liquidity'" :class="{ active: activeTab === 'liquidity' }">Liquidity Metrics</button>
          <button @click="activeTab = 'other'" :class="{ active: activeTab === 'other' }">Other Metrics</button>
        </div>
        <div class="ratios-content">
          <div v-if="activeTab === 'general'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in generalMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'ratios'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Estimation</th>
                  <th>Normal Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in ratios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'network'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in networkMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'social'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in socialMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'liquidity'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in liquidityMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'other'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in otherMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
import axios from 'axios';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  name: 'SharesPage',
  components: {
    LoginPage,
    SignupPage
  },
  data() {
    return {
      isInPortfolio: false,
      activeTab: 'general',
      logoSrc: null,
      companyLogoSrc: null,
      companyName: 'Unknown',
      companyCode: 'unknown',
      showLogin: false,
      showSignup: false,
      isLoggedIn: false,
      showProfileMenu: false,
      userIcon: require('@/assets/default-user.png'), // Replace with actual user icon path
      generalMetrics: [],
      ratios: [],
      networkMetrics: [],
      socialMetrics: [],
      liquidityMetrics: [],
      otherMetrics: [],
      searchQuery: '',
      suggestions: []
    };
  },
  methods: {
    togglePortfolio() {
      if (!this.isLoggedIn) {
        alert('To add this to portfolio, you have to be logged in or registered');
        return;
      }
      this.isInPortfolio = !this.isInPortfolio;
      if (this.isInPortfolio) {
        console.log('Added to portfolio');
      } else {
        console.log('Removed from portfolio');
      }
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
    importLogo(src) {
      try {
        return require(`@/assets/${src}`);
      } catch (e) {
        return require('@/assets/default.png');
      }
    },
    async fetchCompanyDetails() {
      const companyCode = this.$route.params.code || 'unknown';
      try {
        const response = await axios.get(`/api/company-details/${companyCode}`);
        const data = response.data || {};
        this.companyName = data.name || 'Unknown';
        this.companyCode = data.code || 'unknown';
        this.companyLogoSrc = this.importLogo(data.logoSrc || 'default.png');
      } catch (error) {
        console.error('Error fetching company details:', error);
        this.companyName = 'Unknown';
        this.companyCode = 'unknown';
        this.companyLogoSrc = this.importLogo('default.png');
      }
    },
    async fetchMetrics() {
      try {
        const response = await axios.get('/api/crypto-metrics');
        const data = response.data || {};
        this.generalMetrics = data.general || [
          { name: 'Market Cap', value: '500B' },
          { name: 'Revenue', value: '300B' }
        ];
        this.ratios = data.ratios || [
          { name: 'P/E Ratio', value: '25', estimation: 'good', normalValue: '15-25' },
          { name: 'Debt/Equity', value: '0.5', estimation: 'normal', normalValue: '< 1' }
        ];
        this.networkMetrics = data.network || [
          { name: 'Node Count', value: '1000' },
          { name: 'Hash Rate', value: '50 TH/s' }
        ];
        this.socialMetrics = data.social || [
          { name: 'Twitter Followers', value: '1M' },
          { name: 'Reddit Subscribers', value: '500K' }
        ];
        this.liquidityMetrics = data.liquidity || [
          { name: 'Current Ratio', value: '2.0' },
          { name: 'Quick Ratio', value: '1.5' }
        ];
        this.otherMetrics = data.other || [
          { name: 'Employee Count', value: '50K' },
          { name: 'Office Locations', value: '20' }
        ];
      } catch (error) {
        console.error('Error fetching metrics:', error);
        this.generalMetrics = [
          { name: 'Market Cap', value: '500B' },
          { name: 'Revenue', value: '300B' }
        ];
        this.ratios = [
          { name: 'P/E Ratio', value: '25', estimation: 'good', normalValue: '15-25' },
          { name: 'Debt/Equity', value: '0.5', estimation: 'normal', normalValue: '< 1' }
        ];
        this.networkMetrics = [
          { name: 'Node Count', value: '1000' },
          { name: 'Hash Rate', value: '50 TH/s' }
        ];
        this.socialMetrics = [
          { name: 'Twitter Followers', value: '1M' },
          { name: 'Reddit Subscribers', value: '500K' }
        ];
        this.liquidityMetrics = [
          { name: 'Current Ratio', value: '2.0' },
          { name: 'Quick Ratio', value: '1.5' }
        ];
        this.otherMetrics = [
          { name: 'Employee Count', value: '50K' },
          { name: 'Office Locations', value: '20' }
        ];
      }
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
    getEstimationClass(estimation) {
      switch (estimation) {
        case 'good':
          return 'good';
        case 'normal':
          return 'normal';
        case 'overvalued':
          return 'overvalued';
        default:
          return 'not-estimated';
      }
    },
    openConsole(event) {
      console.log("Console opened on right-click", event);
    }
  },
  created() {
    this.logoSrc = this.importLogo('logo.png');
    this.fetchCompanyDetails();
    this.fetchMetrics();
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

.shares-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: #333;
  width: 100%;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap */
  text-align: center;
}

.company-logo {
  height: 80px;
  margin-right: 40px;
}

.company-details {
  display: flex;
  flex-direction: column;
}

.portfolio-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 15px 5px; /* Reduced padding for smaller button */
  cursor: pointer;
  margin-left: 80px;
}

.portfolio-btn:hover {
  background-color: #45a049;
}

.portfolio-btn.remove-btn {
  background-color: #f44336; /* Red color for remove button */
}

.portfolio-btn.remove-btn:hover {
  background-color: #e53935;
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


.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap */
  color: #000;
  text-decoration: none;
  font-size: 22px;
}

.tabs button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  color: #333;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.tabs button:hover {
  background-color: #A3A9A9;
  color: #333;
  transition: 0.2s;
}

.tabs button.active {
  background-color: #333;
  color: #fff;
  transition: 0.2s;
}

.ratios-content {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 23px;
  overflow-x: auto; /* Enable horizontal scrolling */
}

.ratios-content .ratios {
  width: 100%;
}

.ratios-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed; /* Fixed table layout to maintain column widths */
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

td {
  text-align: center;
}

th {
  text-align: center;
}

.good {
  color: green;
}

.normal {
  color: orange;
}

.overvalued {
  color: red;
}

.not-estimated {
  color: gray;
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
  color: #fff; /* Ensure the social links are white */
  text-decoration: none;
}
.footer-social a:hover {
  text-decoration: underline;
}
.footer-right {
  display: flex;
  gap: 20px;
  font-size: 16px;
  margin-top: 20px;
}
.footer-right a {
  color: #fff;
  text-decoration: none;
}
.footer-right a:hover {
  text-decoration: underline;
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

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
}

.auth-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(246, 244, 240, 0.8); /* Updated to add transparency */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.auth-input {
  width: 300px;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
  background-color: #c4c4c4;
  color: #4f4f4f;
  font-size: 16px;
  box-sizing: border-box;
}

.password-container {
  position: relative;
  width: 300px;
}

.toggle-password {
  position: absolute;
  right: 50px;
  top: 35%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: #4f4f4f;
}

button {
  width: 300px;
  padding: 15px;
  background-color: #8c8c8c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

p {
  margin-top: 20px;
  cursor: pointer;
  color: #4f4f4f;
}

h2 {
  color: #4f4f4f;
  margin-top: 0px;
}

/* Responsive Styles */
@media (max-width: 768px) {
    header {
    flex-direction: column;
    align-items: center;
  }

  .logo {
    margin-bottom: 10px;
  }

  nav {
    flex-direction: column;
    gap: 10px;
    margin-right: 0;
  }

  .search-container {
    max-width: 100%;
    margin-bottom: 10px;
  }

  .company-info {
    flex-direction: column;
    text-align: center;
  }

  .company-logo {
    margin-right: 0;
  }

  .portfolio-btn {
    margin-left: 0;
  }

  .tabs {
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
  }

  .footer-content {
    flex-direction: column;
    align-items: flex-start; /* Align items to the start (left) */
  }
  .footer-right {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start; /* Align items to the start (left) */
  }
}
</style>
