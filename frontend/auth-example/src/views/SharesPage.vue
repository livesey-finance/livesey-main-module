<template>
  <div class="shares-page" @contextmenu="openConsole">
    <header>
      <img
        :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')"
        alt="Logo"
        class="logo"
      />
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          @input="fetchSuggestions"
          placeholder="Search stocks and crypto..."
        />
        <ul v-if="searchQuery.length > 0" class="suggestions">
          <li v-if="suggestions.length === 0">no matchings were found</li>
          <li
            v-else
            v-for="item in suggestions.slice(0, 5)"
            :key="item.code"
            @click="selectSuggestion(item)"
          >
            {{ item.name }} ({{ item.code }})
          </li>
        </ul>
      </div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/shares" class="active">Shares</router-link>
        <router-link to="/crypto">Crypto</router-link>
        <router-link to="/portfolio">Portfolio</router-link>
        <router-link to="/calculator">Calculator</router-link>
        <router-link to="/about">About</router-link>
        <a v-if="!isLoggedIn" @click="openLogin">Sign In</a>
        <a v-if="!isLoggedIn" @click="openSignup">Sign Up</a>
        <div v-if="isLoggedIn" class="user-profile">
          <img :src="userIcon" alt="User Icon" @click="toggleProfileMenu" />
          <div v-if="showProfileMenu" class="profile-menu">
            <a @click="viewProfile">Profile</a>
            <a @click="logout">Log Out</a>
          </div>
        </div>
        <label class="theme-toggle">
          <input type="checkbox" @change="toggleTheme" :checked="darkTheme" />
          <span class="slider"></span>
        </label>
      </nav>
    </header>
    <div class="content">
      <div class="company-info">
        <img :src="companyLogoSrc" alt="Company Logo" class="company-logo" />
        <div class="company-details">
          <h1>{{ companyName }}</h1>
          <h2>{{ companyCode }}</h2>
        </div>
        <button @click="openPortfolioModal" :class="['portfolio-btn', { 'remove-btn': isInPortfolio }]">
          {{ isInPortfolio ? '- Remove from portfolio' : '+ Add to portfolio' }}
        </button>
      </div>
      <div class="ratios-container">
        <div class="tabs">
          <button @click="activeTab = 'debt'" :class="{ active: activeTab === 'debt' }">Debt Ratios</button>
          <button @click="activeTab = 'efficiency'" :class="{ active: activeTab === 'efficiency' }">Efficiency Ratios</button>
          <button @click="activeTab = 'liquidity'" :class="{ active: activeTab === 'liquidity' }">Liquidity Ratios</button>
          <button @click="activeTab = 'valuation'" :class="{ active: activeTab === 'valuation' }">Valuation Ratios</button>
          <button @click="activeTab = 'other'" :class="{ active: activeTab === 'other' }">Other Ratios</button>
        </div>
        <div class="ratios-content">
          <div v-if="activeTab === 'debt'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in debtRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'efficiency'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in efficiencyRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'liquidity'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in liquidityRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'valuation'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in valuationRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'other'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in otherRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
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
      <LoginPage @close="closeModal" @switchToSignup="openSignup" @login="handleLogin" />
    </div>
    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal" @click.self="closeModal">
      <SignupPage @close="closeModal" @switchToLogin="openLogin" @signup="handleSignup" />
    </div>
    <!-- Portfolio Modal -->
    <PortfolioStockModal
      v-if="showPortfolioModal"
      :show="showPortfolioModal"
      :isInPortfolio="isInPortfolio"
      :portfolios="userPortfolios"
      @confirm="handlePortfolioChange"
      @close="closePortfolioModal"
    />
  </div>
</template>

<script>
import axios from 'axios';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import PortfolioStockModal from '@/components/PortfolioStockModal.vue';

export default {
  name: 'SharesPage',
  components: {
    LoginPage,
    SignupPage,
    PortfolioStockModal,
  },
  data() {
    return {
      isInPortfolio: false,
      activeTab: 'debt',
      logoSrc: null,
      companyLogoSrc: null,
      companyName: 'Unknown',
      companyCode: 'unknown',
      showLogin: false,
      showSignup: false,
      showPortfolioModal: false,
      isLoggedIn: false,
      showProfileMenu: false,
      debtRatios: [],
      efficiencyRatios: [],
      liquidityRatios: [],
      valuationRatios: [],
      otherRatios: [],
      searchQuery: '',
      suggestions: [],
      darkTheme: false,
      user: null,
      userPortfolios: [], // Add userPortfolios to store portfolios
    };
  },
  computed: {
    // If the user has a custom avatar, display it
    userIcon() {
      return this.user?.avatar || require('@/assets/default-user.png');
    },
  },
  methods: {
    openPortfolioModal() {
      if (!this.isLoggedIn) {
        alert('To add this to the portfolio, you have to be logged in or registered');
        return;
      }
      this.showPortfolioModal = true;
    },
    closePortfolioModal() {
      this.showPortfolioModal = false;
    },
    handlePortfolioChange({ portfolioId, quantity }) {
      if (this.isInPortfolio) {
        // Logic to remove from portfolio
        console.log(`Removing ${quantity} shares from portfolio ${portfolioId}`);
      } else {
        // Logic to add to portfolio
        console.log(`Adding ${quantity} shares to portfolio ${portfolioId}`);
      }
      this.isInPortfolio = !this.isInPortfolio;
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
      this.$router.push(`/profile/${this.user.username}`);
      this.logAction('Viewing Profile');
    },
    handleLogin(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.showLogin = false;
      this.logAction('User Logged In');
      this.loadUserPortfolios(); // Load portfolios after login
    },
    handleSignup(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.showSignup = false;
      this.logAction('User Signed Up');
      this.loadUserPortfolios(); // Load portfolios after signup
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.showProfileMenu = false;
      localStorage.removeItem('user');
      this.logAction('User Logged Out');
    },
    importLogo(src) {
      try {
        const images = require.context('@/assets', false, /\.(png|jpe?g|svg)$/);
        return images(`./${src}`);
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
        this.logAction('Fetched Company Details', { companyCode });
      } catch (error) {
        console.error('Error fetching company details:', error);
        this.companyName = 'Unknown';
        this.companyCode = 'unknown';
        this.companyLogoSrc = this.importLogo('default.png');
        this.logAction('Error Fetching Company Details', { error });
      }
    },
    async fetchMetrics() {
      try {
        const response = await axios.get('/api/shares-metrics');
        const data = response.data || {};
        this.debtRatios = data.debtRatios || [];
        this.efficiencyRatios = data.efficiencyRatios || [];
        this.liquidityRatios = data.liquidityRatios || [];
        this.valuationRatios = data.valuationRatios || [];
        this.otherRatios = data.otherRatios || [];
        this.logAction('Fetched Metrics');
      } catch (error) {
        console.error('Error fetching metrics:', error);
        this.logAction('Error Fetching Metrics', { error });
      }
    },
    async fetchSuggestions() {
      try {
        const response = await axios.get(`/api/search`, {
          params: { query: this.searchQuery },
        });

        // Assuming the response has both stocks and cryptos with a 'category' field
        this.suggestions = response.data || [];

        // Log action for fetching suggestions
        this.logAction('Fetched Suggestions');
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
        this.logAction('Error Fetching Suggestions');
      }
    },
    selectSuggestion(item) {
      // Check item category to route accordingly
      if (item.category === 'stock') {
        this.$router.push(`/shares/${item.code}`);
      } else if (item.category === 'crypto') {
        this.$router.push(`/crypto/${item.code}`);
      }

      this.suggestions = [];
      this.searchQuery = '';
      this.logAction('Selected Suggestion', item);
    },
    openConsole(event) {
      console.log('Console opened on right-click', event);
      this.logAction('Opened Console', { event });
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
      this.logAction('Toggled Theme', { darkTheme: this.darkTheme });
    },
    logAction(action, details = {}) {
      const logEntry = {
        action,
        details,
        timestamp: new Date().toISOString(),
        user: this.user ? this.user.email : 'Guest',
      };
      console.log('Log Entry:', logEntry);
    },
    async loadUserPortfolios() {
      // Example API call to fetch user portfolios
      try {
        const response = await axios.get('/api/user-portfolios');
        this.userPortfolios = response.data || [];
        this.logAction('Loaded User Portfolios');
      } catch (error) {
        console.error('Error loading user portfolios:', error);
        this.logAction('Error Loading User Portfolios', { error });
      }
    },
  },
  created() {
    this.logoSrc = this.importLogo('logo.png');
    this.fetchCompanyDetails();
    this.fetchMetrics();

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
        this.loadUserPortfolios(); // Load portfolios if user is logged in
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  },
};
</script>


<style scoped>
* {
  box-sizing: border-box;
}

html,
body {
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
  color: #383838;
  width: 100%;
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
  background-color: #333;
  color: #fff;
  border: none;
  font-size: 16px;
  padding: 10px;
  background-color: #EBEBEC;
  color: #383838;
  cursor: pointer;
  margin-left: 80px;
}

.portfolio-btn:hover {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
}

.portfolio-btn.remove-btn {
    background-color: #333;
  color: #fff;
  border: none;
  font-size: 16px;
  padding: 10px;
  background-color: #7c7c7c;
  color: #EBEBEC;
  cursor: pointer;
  margin-left: 80px;
}

.portfolio-btn.remove-btn:hover {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
}

.tabs {
  display: flex;
  justify-content: center; /* Center the buttons horizontally */
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap */
  color: #000;
  text-decoration: none;
  font-size: 22px;
  width: 100%; /* Ensure the container takes up the full width */
}

.tabs button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  color: #383838;
  background-color: #EBEBEC;
  border-radius: 5px;
}

.tabs button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
  transition: 0.2s;
}

.tabs button.active {
  background-color: #383838;
  color: #EBEBEC;
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

th,
td {
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
  background-color: #383838;
  color: #EBEBEC;
  padding: 20px;
  box-sizing: border-box;
  margin-top: auto; /* Ensure footer is pushed to the bottom */
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
  color: #383838;
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
  color: #383838;
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

p {
  margin-top: 20px;
  cursor: pointer;
  color: #383838;
}

h2 {
  color: #383838;
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

/* Dark Theme Styles */
.dark-theme {
  background-color: #1E2229;
  color: #BFC3C6;
}

.dark-theme header {
  background-color: #1E2229;
}

.dark-theme h1 {
  color: #BFC3C6;
}

.dark-theme h2 {
  color: #BFC3C6;
}

.dark-theme nav a {
  color: #BFC3C6;
}

.dark-theme nav a:hover {
  background-color: #8794A0;
  color: #ffffff;
}

.dark-theme nav a.active {
  background-color: #2F4172;
  color: #ffffff;
}

.dark-theme .content {
  background-color: #161b22;
}

.dark-theme footer {
  background-color: #1E2229;
  color: #BFC3C6;
}

.dark-theme .profile-menu {
  background-color: #21262d;
}

.dark-theme .search-container input {
  background-color: #161b22;
  color: #BFC3C6;
  border-color: #30363d;
}

.dark-theme .suggestions {
  background-color: #161b22;
  border-color: #30363d;
}

.dark-theme .suggestions li {
  color: #BFC3C6;
}

.dark-theme .suggestions li:hover {
  background-color: #21262d;
}

.dark-theme .side-panel {
  background-color: #21262d;
  border-color: #30363d;
  color: #BFC3C6;
}

.dark-theme .ratios-table th, .dark-theme .ratios-table td {
  background-color: #21262d;
  color: #BFC3C6;
  border-bottom: 1px solid #30363d;
}

.dark-theme .portfolio-btn {
  background-color: #f0f0f0;
  color: #333;
}

.dark-theme .portfolio-btn:hover {
  background-color: #333;
  color: #f0f0f0;
}

.dark-theme .portfolio-btn.remove-btn {
  background-color: #f0f0f0;
  color: #333;
}

.dark-theme.portfolio-btn.remove-btn:hover {
  background-color: #333;
  color: #f0f0f0;
}

.dark-theme button {
  color: #21262d;
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
  background-color: #7487a4;
}

input:checked + .slider:before {
  transform: translateX(20px);
}
</style>
