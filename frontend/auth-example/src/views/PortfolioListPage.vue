<template>
  <div :class="['portfolio-list-container', { 'dark-theme': darkTheme }]">
    <header>
      <img :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" alt="Logo" class="logo" />
      <div class="search-container">
        <input type="text" v-model="searchQuery" @input="fetchSuggestions" placeholder="Search portfolios..." />
        <ul v-if="searchQuery.length > 0" class="suggestions">
          <li v-if="suggestions.length === 0">No matchings were found</li>
          <li v-else v-for="item in suggestions.slice(0, 5)" :key="item.username" @click="selectSuggestion(item)">
            {{ item.name }} ({{ item.username }})
          </li>
        </ul>
      </div>
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/shares">Shares</router-link>
        <router-link to="/crypto">Crypto</router-link>
        <router-link to="/portfolio" class="active">Portfolio</router-link>
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
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <main class="main-container">
      <div class="portfolio-actions-container">
        <h1>User Portfolios</h1>
        <button @click="checkLoginStatus" :disabled="portfolios.length >= 15">
          Add Portfolio
        </button>
        <div v-if="portfolios.length >= 15" class="limit-message">You have reached the maximum limit of 15 portfolios.</div>
      </div>

      <div class="portfolio-list">
        <div v-for="portfolio in paginatedPortfolios" :key="portfolio.username" class="portfolio-item">
          <div class="portfolio-info" @click="openPortfolio(portfolio)">
            <h3>{{ portfolio.name }}</h3>
            <p>{{ portfolio.description }}</p>
          </div>
          <div class="portfolio-actions">
            <button @click.stop="renamePortfolio(portfolio)">Rename</button>
            <button @click.stop="deletePortfolio(portfolio)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Pagination controls -->
      <div class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>

      <div v-if="showPortfolioForm" class="modal" @click.self="closePortfolioForm">
        <PortfolioForm @close="closePortfolioForm" @add="addPortfolio" />
      </div>

      <!-- Modal for managing stocks in a portfolio -->
      <div v-if="showStockModal" class="modal" @click.self="closeStockModal">
        <PortfolioStockModal 
          :show="showStockModal" 
          :isInPortfolio="isInPortfolio" 
          :portfolios="portfolios" 
          @confirm="handleStockAction" 
          @close="closeStockModal" />
      </div>

      <div v-if="error" class="error">{{ error }}</div>
    </main>

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
import PortfolioForm from "@/components/PortfolioForm.vue";
import PortfolioStockModal from "@/components/PortfolioStockModal.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import { getPortfolios, addPortfolio as mockAddPortfolio, updatePortfolio as mockUpdatePortfolio, deletePortfolio as mockDeletePortfolio } from "@/mocks/portfolioListVue.js";
import axios from 'axios';

export default {
  name: "PortfolioListPage",
  components: {
    PortfolioForm,
    PortfolioStockModal,
    LoginPage,
    SignupPage
  },
  data() {
    return {
      portfolios: [],
      currentPage: 1,
      portfoliosPerPage: 5,
      showPortfolioForm: false,
      showStockModal: false,
      selectedPortfolio: null,
      error: null,
      showLogin: false,
      showSignup: false,
      isLoggedIn: false,
      showProfileMenu: false,
      searchQuery: '',
      suggestions: [],
      darkTheme: false,
      user: null,
    };
  },
  computed: {
    userIcon() {
      return this.user?.avatar || require('@/assets/default-user.png');
    },
    totalPages() {
      return Math.ceil(this.portfolios.length / this.portfoliosPerPage);
    },
    paginatedPortfolios() {
      const start = (this.currentPage - 1) * this.portfoliosPerPage;
      const end = start + this.portfoliosPerPage;
      return this.portfolios.slice(start, end);
    },
  },
  methods: {
    async loadPortfolios() {
      try {
        if (this.isLoggedIn) {
          const savedPortfolios = localStorage.getItem('portfolios');
          if (savedPortfolios) {
            this.portfolios = JSON.parse(savedPortfolios);
          } else {
            this.portfolios = await getPortfolios();
            localStorage.setItem('portfolios', JSON.stringify(this.portfolios));
          }
        } else {
          this.portfolios = [];
        }
      } catch (error) {
        this.error = "Failed to load portfolios.";
        console.error("Error loading portfolios:", error);
      }
    },
    savePortfolios() {
      localStorage.setItem('portfolios', JSON.stringify(this.portfolios));
    },
    openPortfolio(portfolio) {
      this.$router.push(`/portfolio/${portfolio.username}`);
    },
    checkLoginStatus() {
      if (this.isLoggedIn) {
        this.openPortfolioForm();
      } else {
        this.error = "You must be logged in to add a portfolio.";
      }
    },
    openPortfolioForm() {
      this.showPortfolioForm = true;
    },
    closePortfolioForm() {
      this.showPortfolioForm = false;
    },
    openPortfolioStockModal(portfolio) {
      this.selectedPortfolio = portfolio;
      this.showStockModal = true;
    },
    closeStockModal() {
      this.selectedPortfolio = null;
      this.showStockModal = false;
    },
    async handleStockAction({ portfolioId, quantity }) {
      try {
        console.log(`Updating portfolio ${portfolioId} with quantity ${quantity}`);
        await this.loadPortfolios();
        this.closeStockModal();
      } catch (error) {
        console.error("Error updating stocks:", error);
        this.error = "Failed to update stocks.";
      }
    },
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
      }
    },
    async addPortfolio(newPortfolio) {
      if (this.portfolios.length >= 15) {
        this.error = "You have reached the maximum limit of 15 portfolios.";
        return;
      }
      try {
        if (this.isLoggedIn) {
          const addedPortfolio = await mockAddPortfolio(newPortfolio);
          this.portfolios.push(addedPortfolio);
          this.savePortfolios();
          this.closePortfolioForm();
          this.error = null;
        } else {
          this.error = "You must be logged in to add a portfolio.";
        }
      } catch (error) {
        console.error("Error adding portfolio:", error);
        this.error = "Failed to add portfolio";
      }
    },
    async renamePortfolio(portfolio) {
      const newName = prompt("Enter new portfolio name:", portfolio.name);
      if (newName) {
        try {
          const updatedPortfolio = await mockUpdatePortfolio(portfolio.username, { name: newName });
          const index = this.portfolios.findIndex(p => p.username === portfolio.username);
          if (index !== -1) {
            this.portfolios.splice(index, 1, updatedPortfolio);
            this.savePortfolios();
          }
        } catch (error) {
          console.error("Error renaming portfolio:", error);
          this.error = "Failed to rename portfolio: " + error.message;
        }
      }
    },
    async deletePortfolio(portfolio) {
      // Verify the portfolio exists in the local state before attempting to delete
      const portfolioIndex = this.portfolios.findIndex(p => p.username === portfolio.username);
      if (portfolioIndex === -1) {
        this.error = "Portfolio not found in local state.";
        return;
      }

      try {
        // Attempt to delete the portfolio from the backend
        await mockDeletePortfolio(portfolio.username);
        
        // Remove the portfolio from the local state if the backend deletion was successful
        this.portfolios.splice(portfolioIndex, 1);
        this.savePortfolios();
        this.error = null; // Clear any previous error messages

      } catch (error) {
        console.error("Error deleting portfolio:", error);
        this.error = "Failed to delete portfolio: " + error.message;
      }
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
      this.logAction('Toggled Profile Menu');
    },
    viewProfile() {
      this.$router.push(`/profile/${this.user.username}`);
      this.logAction('Viewing Profile');
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.showProfileMenu = false;
      localStorage.removeItem('user');
      localStorage.removeItem('portfolios');
      this.logAction('User Logged Out');
      this.loadPortfolios(); // Clear portfolios upon logging out
    },
    handleLogin(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.showLogin = false;
      this.error = null; // Clear any error messages upon successful login
      this.userIcon = this.user.avatar || require('@/assets/default-user.png');
      this.logAction('User Logged In');
      this.loadPortfolios(); // Load portfolios after logging in
    },
    handleSignup(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.showSignup = false;
      this.error = null; // Clear any error messages upon successful signup
      this.userIcon = this.user.avatar || require('@/assets/default-user.png');
      this.logAction('User Signed Up');
      this.loadPortfolios(); // Load portfolios after signing up
    },
    async fetchSuggestions() {
      try {
        const response = await axios.get(`/api/search`, {
          params: { query: this.searchQuery },
        });

        this.suggestions = response.data || [];
        this.logAction('Fetched Suggestions');
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
        this.logAction('Error Fetching Suggestions');
      }
    },
    selectSuggestion(item) {
      if (item.category === 'stock') {
        this.$router.push(`/shares/${item.code}`);
      } else if (item.category === 'crypto') {
        this.$router.push(`/crypto/${item.code}`);
      }

      this.suggestions = [];
      this.searchQuery = '';
      this.logAction('Selected Suggestion', item);
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
        this.userIcon = this.user.avatar || require('@/assets/default-user.png');
        this.logAction('Restored User Session');
        this.loadPortfolios(); // Load portfolios if the user is logged in
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    } else {
      this.loadPortfolios(); // Clear portfolios if no user is logged in
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
  overflow-x: hidden;
}
.app-container {
  transition: opacity 0.3s ease;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.portfolio-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  color: #383838;
  min-height: 100vh; /* Use min-height to ensure it takes the full height */
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

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1; /* Allow main to grow and take available space */
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 15px; /* Add margin-top to create space below nav */
}
.portfolio-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  max-width: 800px;
}

.portfolio-actions-container button {
  padding: 10px 40px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  color: #383838;
  background-color: #EBEBEC;
  border-radius: 5px;
}

.portfolio-actions-container button:hover {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
}

.portfolio-actions-container button.active {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
}

.portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 800px;
  margin-top: -10px;
}
.portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out; /* Apply transition to the default state */
}

.portfolio-item:hover {
  transform: scale(1.03);
}

.portfolio-info {
  cursor: pointer;
}

.dark-theme .portfolio-item {
  background-color: #21262d;
  color: #BFC3C6;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.dark-theme .portfolio-info {
  cursor: pointer;
}

.portfolio-actions button {
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  background-color: #EBEBEC;
  color: #383838;
  border-radius: 5px;
}

.portfolio-actions button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
  transition: 0.2s;
}

.portfolio-actions button.active {
  background-color: #383838;
  color: #EBEBEC;
}

.search-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
  flex-grow: 1;
  max-width: 400px;
  position: relative;
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
.error {
  color: red;
  margin-top: 10px;
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
/* Dark Theme Styles */
.dark-theme {
  background-color: #0d1117;
  color: #BFC3C6;
}
.dark-theme footer {
  background-color: #1E2229;
  color: #BFC3C6;
}
.dark-theme header {
  background-color: #1E2229;
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
.dark-theme .profile-menu {
  background-color: #161c24;
  color: #BFC3C6;
}

.dark-theme .profile-menu a {
  color: #BFC3C6;
}

.dark-theme .profile-menu a:hover {
  background-color: #8794A0;
  color: #ffffff;
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

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .logo {
    margin-left: 0;
    height: 50px;
  }
  
  nav {
    flex-wrap: wrap;
    margin-right: 0;
    font-size: 18px;
  }
  
  .search-container {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }
  
  .search-container input {
    width: 100%;
  }
  
  .portfolio-actions-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .portfolio-list {
    width: 100%;
  }
  
  .footer-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .footer-right {
    margin-top: 10px;
  }
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap; /* Ensure items don't wrap to new lines */
}

.pagination button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #EBEBEC;
  color: #383838;
  border-radius: 5px;
  white-space: nowrap; /* Prevent text from wrapping inside buttons */
  display: flex;
  align-items: center; /* Center content vertically */
  justify-content: center; /* Center content horizontally */
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
  transition: 0.2s;
}

.limit-message {
  color: red;
  margin-top: 10px;
  margin-left: 20px;
  font-weight: bold;
}
</style>
