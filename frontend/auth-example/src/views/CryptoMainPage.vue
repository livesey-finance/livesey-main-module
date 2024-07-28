<template>
  <div :class="['crypto-main-page', { 'dark-theme': darkTheme }]">
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
        <a href="#" class="active">Crypto</a>
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
        <label class="theme-toggle">
          <input type="checkbox" @change="toggleTheme" :checked="darkTheme" />
          <span class="slider"></span>
        </label>
      </nav>
    </header>
    <div class="content">
      <div class="main-content">
        <div class="header-with-buttons">
          <h1>Cryptocurrency</h1>
        </div>
        <div v-if="activeSection === 'price'" class="shares-table-container">
          <CryptoTable
            :data="paginatedPriceData"
            :additionalFields="['Name', 'Last', 'Change[1h]', 'Change[24h]', 'Change[7d]', 'Time']"
            :darkTheme="darkTheme"
          />
        </div>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>
      <div class="side-panel">
        <div class="side-category">
          <h3>Top 10:</h3>
          <button @click="activeCategory = 'gainers'" :class="{ active: activeCategory === 'gainers' }">Gainers %</button>
          <button @click="activeCategory = 'losers'" :class="{ active: activeCategory === 'losers' }">Losers %</button>
        </div>
        <div v-if="activeCategory === 'gainers'" class="side-content">
          <CryptoTable :data="gainers" :additionalFields="['Code', 'Last', 'Change[24h]']" :isTopTen="true" :darkTheme="darkTheme" />
        </div>
        <div v-else class="side-content">
          <CryptoTable :data="losers" :additionalFields="['Code', 'Last', 'Change[24h]']" :isTopTen="true" :darkTheme="darkTheme" />
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
import axios from 'axios';
import CryptoTable from './CryptoTable.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  name: 'CryptoPage',
  components: {
    CryptoTable,
    LoginPage,
    SignupPage
  },
  data() {
    return {
      activeSection: 'price',
      activeCategory: 'gainers',
      logoSrc: null,
      showLogin: false,
      showSignup: false,
      isLoggedIn: false,
      showProfileMenu: false,
      userIcon: require('@/assets/default-user.png'), // Замість з правильним шляхом до іконки користувача
      priceData: [],
      cryptoData: [], // Added cryptoData
      gainers: [],
      losers: [],
      currentPage: 1,
      itemsPerPage: 25,
      searchQuery: '',
      suggestions: [],
      darkTheme: false, // Add theme state
      user: null // Додаємо змінну для зберігання інформації про користувача
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.priceData.length / this.itemsPerPage);
    },
    paginatedPriceData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.priceData.slice(start, end);
    }
  },
  methods: {
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
      // Navigate to profile page or show profile details
      console.log('Viewing profile');
      this.logAction('Viewing Profile');
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null; // Видаляємо інформацію про користувача при логауті
      this.showProfileMenu = false;
      localStorage.removeItem('user');
      this.logAction('User Logged Out');
      // Perform any additional logout operations, like clearing tokens
    },
    handleLogin(user) {
      this.isLoggedIn = true;
      this.user = user; // Зберігаємо інформацію про користувача
      localStorage.setItem('user', JSON.stringify(user));
      this.showLogin = false;
      this.logAction('User Logged In');
    },
    handleSignup(user) {
      this.isLoggedIn = true;
      this.user = user; // Зберігаємо інформацію про користувача
      localStorage.setItem('user', JSON.stringify(user));
      this.showSignup = false;
      this.logAction('User Signed Up');
    },
    async fetchSuggestions() {
      try {
        const response = await axios.get(`/api/search`, { params: { query: this.searchQuery } });
        this.suggestions = response.data || [];
        this.logAction('Fetched Suggestions');
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
        this.logAction('Error Fetching Suggestions');
      }
    },
    selectSuggestion(item) {
      this.$router.push(`/crypto/${item.code}`);
      this.suggestions = [];
      this.searchQuery = '';
      this.logAction('Selected Suggestion', item);
    },
    importLogo(src) {
      try {
        const images = require.context('@/assets', false, /\.(png|jpe?g|svg)$/);
        return images(`./${src}`);
      } catch (e) {
        return require('@/assets/default.png');
      }
    },
    async fetchSharesData() {
      try {
        const response = {
          data: {
            price: [
              { name: 'Apple', code: 'AAPL', last: 145.64, high: 147.10, low: 144.89, change: -1.23, changePercent: -0.84, volume: 74232310, time: '16:00' },
              { name: 'Microsoft', code: 'MSFT', last: 299.35, high: 301.45, low: 298.12, change: -2.00, changePercent: -0.66, volume: 24133190, time: '16:00' },
              // Add 38 more example price data items
              ...Array.from({ length: 38 }, (_, i) => ({
                name: `Company${i + 1}`,
                code: `COMP${i + 1}`,
                last: Math.random() * 100,
                high: Math.random() * 100,
                low: Math.random() * 100,
                change: Math.random() * 10,
                changePercent: Math.random() * 10,
                volume: Math.floor(Math.random() * 1000000),
                time: '16:00'
              }))
            ],
            fundamental: [
              { name: 'Apple', code: 'AAPL', marketCap: '2.41T', revenue: '365.82B', peRatio: 28.43, eps: 5.61, beta: 1.20 },
              { name: 'Microsoft', code: 'MSFT', marketCap: '2.29T', revenue: '184.90B', peRatio: 33.84, eps: 8.05, beta: 0.91 },
              // Add 38 more example fundamental data items
              ...Array.from({ length: 38 }, (_, i) => ({
                name: `Company${i + 1}`,
                code: `COMP${i + 1}`,
                marketCap: `${Math.random() * 1000}B`,
                revenue: `${Math.random() * 1000}B`,
                peRatio: Math.random() * 100,
                eps: Math.random() * 10,
                beta: Math.random() * 2
              }))
            ],
            gainers: [
              { code: 'TSLA', last: 620.83, changePercent: 5.23 },
              { code: 'NVDA', last: 750.25, changePercent: 4.89 }
            ],
            losers: [
              { code: 'NFLX', last: 520.23, changePercent: -3.14 },
              { code: 'FB', last: 330.45, changePercent: -2.56 }
            ]
          }
        };
        this.priceData = response.data.price || [];
        this.fundamentalData = response.data.fundamental || [];
        this.gainers = response.data.gainers || [];
        this.losers = response.data.losers || [];
        this.logAction('Fetched Shares Data');
      } catch (error) {
        console.error('Error fetching shares data:', error);
        this.priceData = [];
        this.fundamentalData = [];
        this.gainers = [];
        this.losers = [];
        this.logAction('Error Fetching Shares Data');
      }
    },
    async fetchCryptoData() {
      try {
        const response = await axios.get('/api/crypto'); // Replace with your API endpoint
        this.cryptoData = response.data || [];
        this.logAction('Fetched Cryptocurrency Data');
      } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        this.cryptoData = [];
        this.logAction('Error Fetching Cryptocurrency Data');
      }
    },
    changeSection(section) {
      this.activeSection = section;
      this.currentPage = 1; // Reset to the first page when changing sections
      this.logAction('Changed Section', { section });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.logAction('Changed Page', { page: this.currentPage });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.logAction('Changed Page', { page: this.currentPage });
      }
    },
    openConsole(event) {
      console.log('Console opened on right-click', event);
      this.logAction('Opened Console', { event });
    },
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
      if (this.darkTheme) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
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
  created() {
    this.logoSrc = this.importLogo('logo.png');
    this.fetchSharesData();
    this.fetchCryptoData(); // Added call to fetch cryptocurrency data

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.darkTheme = false;
      document.body.classList.remove('dark-theme');
    }

    // Initialize user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.isLoggedIn = true;
      this.logAction('Restored User Session');
    }
  }
};
</script>



<style scoped>
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

.content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  padding: 20px;
  flex-wrap: wrap; /* Allow flex items to wrap */
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Ensure it takes full width */
}

.header-with-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.header-with-buttons h1 {
  flex: 1;
  margin: 0;
}

.switch-container {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  align-items: center;
}

.switch-container button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.switch-container button:hover {
  background-color: #A3A9A9;
  color: #333;
  transition: 0.2s;
}

.switch-container button.active {
  background-color: #333;
  color: #fff;
}

.shares-table-container {
  width: 100%; /* Ensure it takes full width */
  overflow-x: auto; /* Add horizontal scroll */
  margin-top: 30px; /* Added margin-top to create space between the header and the table */
}

.shares-table table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.shares-table th,
.shares-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  white-space: nowrap; /* Prevent text wrapping for better layout on smaller screens */
}

.shares-table th {
  background-color: #f0f0f0;
}

.shares-table tbody tr:hover {
  background-color: #f9f9f9;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  border-radius: 5px;
    color: #000;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination button:hover {
  background-color: #A3A9A9;
  color: #333;
  transition: 0.2s;
}

.side-panel {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-top: 20px; /* Added margin-top for better spacing */
  background-color: #f9f9f9;
}

.side-category {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-category button {
  padding: 10px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  border-radius: 5px;
    color: #000;
}

.side-category button:hover {
  background-color: #A3A9A9;
  color: #333;
  transition: 0.2s;
}

.side-category button.active {
  background-color: #333;
  color: #fff;
}

.side-content {
  margin-top: 20px;
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
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

@media (max-width: 1200px) {
  nav {
    font-size: 20px;
  }
}

@media (max-width: 992px) {
  .content {
    flex-direction: column;
    align-items: stretch;
  }

  .side-panel {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e0e0e0;
    margin-top: 20px;
    padding-top: 20px;
  }
}

@media (max-width: 768px) {
  nav {
    gap: 20px;
  }

  .switch-container {
    flex-direction: column;
    gap: 10px;
  }

  .footer-content {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 576px) {
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
  .switch-container {
    align-items: center;
  }

  .header-with-buttons h1 {
    text-align: center;
  }
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

.dark-theme .shares-table th,
.dark-theme .shares-table td {
  color: #c9d1d9;
  border-bottom: 1px solid #30363d;
}

.dark-theme .shares-table tbody tr:hover {
  background-color: #2c3a47;
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

.dark-theme .side-panel {
  background-color: #21262d;
  border-color: #21262d;
}

.dark-theme .footer-logo, .dark-theme .footer-social a, .dark-theme .footer-right a {
  color: #c9d1d9;
}

.dark-theme footer {
  background-color: #1e1e1e;
}

button, a {
  color: #ffffff;
}

.dark-theme button {
  color: #21262d;
}

.user-profile {
  display: flex;
  align-items: center;
  position: relative;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
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
  text-decoration: none;
  color: #333;
}

.profile-menu a:hover {
  background-color: #f0f0f0;
}

.dark-theme .profile-menu {
  background-color: #161b22;
}

.dark-theme .profile-menu a {
  color: #c9d1d9;
}

.dark-theme .profile-menu a:hover {
  background-color: #134B70;
}

.user-profile {
  display: flex;
  align-items: center;
  position: relative;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
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
  text-decoration: none;
  color: #333;
}

.profile-menu a:hover {
  background-color: #f0f0f0;
}

.dark-theme .profile-menu {
  background-color: #161b22;
}

.dark-theme .profile-menu a {
  color: #c9d1d9;
}

.dark-theme .profile-menu a:hover {
  background-color: #134B70;
}


</style>
