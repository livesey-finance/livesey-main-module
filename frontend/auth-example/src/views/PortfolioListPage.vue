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

    <main>
      <div class="portfolio-actions-container">
        <h1>User Portfolios</h1>
        <button @click="openPortfolioForm" :disabled="portfolios.length >= 10">
          Add Portfolio
        </button>
      </div>

      <div class="portfolio-list">
        <div v-for="portfolio in portfolios" :key="portfolio.username" class="portfolio-item">
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

      <div v-if="showPortfolioForm" class="modal" @click.self="closePortfolioForm">
        <PortfolioForm @close="closePortfolioForm" @add="addPortfolio" />
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
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import { getPortfolios, addPortfolio, updatePortfolio, deletePortfolio } from "@/mocks/portfolioListVue.js";

export default {
  name: "PortfolioListPage",
  components: {
    PortfolioForm,
    LoginPage,
    SignupPage
  },
  data() {
    return {
      portfolios: [],
      showPortfolioForm: false,
      error: null,
      showLogin: false,
      showSignup: false,
      isLoggedIn: false,
      showProfileMenu: false,
      userIcon: require('@/assets/default-user.png'),
      searchQuery: '',
      suggestions: [],
      darkTheme: false,
      user: null
    };
  },
  methods: {
    async loadPortfolios() {
      try {
        // Симулюємо отримання портфоліо з бекенду
        this.portfolios = await getPortfolios();
      } catch (error) {
        this.error = "Failed to load portfolios.";
        console.error("Error loading portfolios:", error);
      }
    },
    openPortfolio(portfolio) {
      this.$router.push(`/portfolio/${portfolio.username}`);
    },
    openPortfolioForm() {
      this.showPortfolioForm = true;
    },
    closePortfolioForm() {
      this.showPortfolioForm = false;
    },
    async addPortfolio(newPortfolio) {
      try {
        await addPortfolio(newPortfolio);
        // Після успішного додавання нове портфоліо не додаємо вручну до масиву `portfolios`
        await this.loadPortfolios(); // Замість цього оновлюємо список портфоліо
        this.closePortfolioForm();
        this.error = null;
      } catch (error) {
        console.error("Error adding portfolio:", error);
        this.error = "Failed to add portfolio";
      }
    },
    async renamePortfolio(portfolio) {
      const newName = prompt("Enter new portfolio name:", portfolio.name);
      if (newName) {
        try {
          const updatedPortfolio = await updatePortfolio(portfolio.username, { name: newName });
          const index = this.portfolios.findIndex(p => p.username === portfolio.username);
          if (index !== -1) {
            this.portfolios.splice(index, 1, updatedPortfolio);
          }
        } catch (error) {
          console.error("Error renaming portfolio:", error);
          this.error = "Failed to rename portfolio";
        }
      }
    },
    async deletePortfolio(portfolio) {
      try {
        await deletePortfolio(portfolio.username);
        this.portfolios = this.portfolios.filter(
          (p) => p.username !== portfolio.username
        );
      } catch (error) {
        console.error("Error deleting portfolio:", error);
        this.error = "Failed to delete portfolio";
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
    },
    viewProfile() {
      console.log('Viewing profile');
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null; // Clear user information on logout
      this.showProfileMenu = false;
      // Perform any additional logout operations, like clearing tokens
    },
    handleLogin(user) {
      this.isLoggedIn = true;
      this.user = user || {}; // Ensure user is an object
      this.userIcon = this.user.avatar || require('@/assets/default-user.png'); // Set user icon
      this.showLogin = false;
    },
    handleSignup(user) {
      this.isLoggedIn = true;
      this.user = user || {}; // Ensure user is an object
      this.userIcon = this.user.avatar || require('@/assets/default-user.png'); // Set user icon
      this.showSignup = false;
    },
    async fetchSuggestions() {
      try {
        // Симулюємо отримання пропозицій
        this.suggestions = this.portfolios.filter(p => 
          p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.suggestions = [];
      }
    },
    selectSuggestion(item) {
      if (item.username) {
        this.$router.push(`/portfolio/${item.username}`);
      }
      this.suggestions = [];
      this.searchQuery = '';
    }
  },
  mounted() {
    this.loadPortfolios();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.darkTheme = false;
      document.body.classList.remove('dark-theme');
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
.portfolio-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #000;
  min-height: 100vh; /* Use min-height to ensure it takes the full height */
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
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1; /* Allow main to grow and take available space */
  overflow-y: auto;
  overflow-x: hidden;
}
.portfolio-actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;
  max-width: 800px;
}
.portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 800px;
}
.portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.portfolio-info {
  cursor: pointer;
}
.portfolio-actions button {
  margin-left: 10px;
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
  background-color: #333;
  color: #fff;
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
