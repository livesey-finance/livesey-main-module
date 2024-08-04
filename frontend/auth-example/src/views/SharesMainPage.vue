<template>
  <div class="shares-page" @contextmenu="openConsole">
    <!-- Header and Navigation -->
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

    <!-- Main Content -->
    <div class="content">
      <div class="main-content">
        <div class="header-with-buttons">
          <h1>Stock Quotes</h1>
          <div class="switch-container">
            <button
              @click="changeSection('price')"
              :class="{ active: activeSection === 'price' }"
            >
              Price
            </button>
            <button
              @click="changeSection('fundamental')"
              :class="{ active: activeSection === 'fundamental' }"
            >
              Fundamental
            </button>
          </div>
        </div>

        <div v-if="activeSection === 'price'" class="shares-table-container">
          <SharesTable
            :data="paginatedPriceData"
            :additionalFields="['Name', 'Last', 'High', 'Low', 'Change', 'Change%', 'Volume']"
            :darkTheme="darkTheme"
          />
        </div>

        <div v-else class="shares-table-container">
          <SharesTable
            :data="paginatedFundamentalData"
            :additionalFields="['Market Cap', 'Revenue', 'P/E Ratio', 'EPS', 'Beta']"
            :darkTheme="darkTheme"
          />
        </div>

        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            Next
          </button>
        </div>
      </div>

      <div class="side-panel">
        <div class="side-category">
          <h3>Top 10:</h3>
          <button
            @click="activeCategory = 'gainers'"
            :class="{ active: activeCategory === 'gainers' }"
          >
            Gainers %
          </button>
          <button
            @click="activeCategory = 'losers'"
            :class="{ active: activeCategory === 'losers' }"
          >
            Losers %
          </button>
        </div>

        <div v-if="activeCategory === 'gainers'" class="side-content">
          <SharesTable
            :data="gainers"
            :additionalFields="['Code', 'Last', 'Change%']"
            :isTopTen="true"
            :darkTheme="darkTheme"
          />
        </div>

        <div v-else class="side-content">
          <SharesTable
            :data="losers"
            :additionalFields="['Code', 'Last', 'Change%']"
            :isTopTen="true"
            :darkTheme="darkTheme"
          />
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
import { mockSharesData } from "@/mocks/sharesMainMock.js";
import SharesTable from "./SharesTable.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import axios from "axios"

export default {
  name: "SharesPage",
  components: {
    SharesTable,
    LoginPage,
    SignupPage, // Correct import
  },
  data() {
    return {
      activeSection: "price",
      activeCategory: "gainers",
      logoSrc: null,
      showLogin: false,
      showSignup: false,
      showProfileMenu: false,
      priceData: [],
      fundamentalData: [],
      gainers: [],
      losers: [],
      currentPage: 1,
      itemsPerPage: 25,
      searchQuery: "",
      suggestions: [],
      darkTheme: false,
      isLoggedIn: false,
      user: null,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(
        (this.activeSection === "price"
          ? this.priceData.length
          : this.fundamentalData.length) / this.itemsPerPage
      );
    },
    paginatedPriceData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.priceData.slice(start, end);
    },
    paginatedFundamentalData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.fundamentalData.slice(start, end);
    },
    userIcon() {
      return this.user?.avatar || require("@/assets/default-user.png");
    },
  },
  methods: {
    openLogin() {
      this.showLogin = true;
      this.showSignup = false;
      this.logAction("Opened Login Modal");
    },
    openSignup() {
      this.showSignup = true;
      this.showLogin = false;
      this.logAction("Opened Signup Modal");
    },
    closeModal() {
      this.showLogin = false;
      this.showSignup = false;
      this.logAction("Closed Modal");
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
      localStorage.removeItem("user");
      this.logAction("User Logged Out");
    },
    handleLogin(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      this.showLogin = false;
      this.logAction("User Logged In");
    },
    handleSignup(user) {
      this.isLoggedIn = true;
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      this.showSignup = false;
      this.logAction("User Signed Up");
    },
    fetchSharesData() {
      // Use mock data instead of API
      this.priceData = mockSharesData.price || [];
      this.fundamentalData = mockSharesData.fundamental || [];
      this.gainers = mockSharesData.gainers || [];
      this.losers = mockSharesData.losers || [];
      this.logAction("Fetched Shares Data");
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
      // Save selected company data to localStorage
      localStorage.setItem('selectedCompany', JSON.stringify(item));

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
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.logAction("Changed Page", { page: this.currentPage });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.logAction("Changed Page", { page: this.currentPage });
      }
    },
    openConsole(event) {
      console.log("Console opened on right-click", event);
      this.logAction("Opened Console", { event });
    },
    toggleTheme() {
      this.darkTheme = !this.darkTheme;
      if (this.darkTheme) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
      }
      this.logAction("Toggled Theme", { darkTheme: this.darkTheme });
    },
    changeSection(section) {
      this.activeSection = section;
      this.logAction("Changed Section", { section: this.activeSection });
    },
    importLogo(src) {
      try {
        const images = require.context("@/assets", false, /\.(png|jpe?g|svg)$/);
        return images(`./${src}`);
      } catch (e) {
        return require("@/assets/default.png");
      }
    },
    logAction(action, details = {}) {
      const logEntry = {
        action,
        details,
        timestamp: new Date().toISOString(),
        user: this.user ? this.user.email : "Guest",
      };
      console.log("Log Entry:", logEntry);
    },
  },
  created() {
    this.logoSrc = this.importLogo("logo.png");
    this.fetchSharesData();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.darkTheme = true;
      document.body.classList.add("dark-theme");
    } else {
      this.darkTheme = false;
      document.body.classList.remove("dark-theme");
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
        this.isLoggedIn = true;
        this.logAction("Restored User Session");
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }
  },
};
</script>


<style scoped>
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
  background-color: #EBEBEC;
  color: #383838;
  border-radius: 5px;
}

.switch-container button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
  transition: 0.2s;
}

.switch-container button.active {
  background-color: #383838;
  color: #EBEBEC;
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
  background-color: #EBEBEC;
  color: #383838;
  border-radius: 5px;
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

.pagination span {
  margin: 0 10px; /* Adjust margin to fit better between buttons */
  white-space: nowrap; /* Ensure the text doesn't wrap */
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

.side-panel {
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
  color: #383838;
  font-family: Arial, sans-serif;
  font-size: 18px;
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
  background-color: #EBEBEC;
  color: #383838;
  border-radius: 5px;
  font-family: Arial, sans-serif;
  font-size: 16px;
}

.side-category button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
  transition: 0.2s;
}

.side-category button.active {
  background-color: #383838;
  color: #EBEBEC;
}

.side-content {
  margin-top: 20px;
  color: #383838;
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
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
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
.profile-container {
  position: relative;
}
.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
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

/* Dark Theme Styles */
.dark-theme {
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

.dark-theme .shares-table tbody tr:hover {
  background-color: #2c3a47;
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

.dark-theme .side-panel th {
  background-color: #21262d;
  color: #BFC3C6;
  border-bottom: 1px solid #30363d;
}

.dark-theme .side-panel {
  background-color: #1E2229;
  border-color: #21262d;
  color: #BFC3C6;
}

.dark-theme .content {
  background-color: #161b22;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  padding: 20px;
  flex-wrap: wrap; /* Allow flex items to wrap */
}

.dark-theme h1 {
  color: #BFC3C6;
}

.dark-theme .content {
  background-color: #0d1117;
  color: #BFC3C6;
}

.dark-theme h3 {
  color: #BFC3C6;
}

.dark-theme .side-panel .td{
  color: #BFC3C6;
}

.dark-theme footer {
  background-color: #1E2229;
  color: #BFC3C6;
}

.dark-theme span {
  color: #BFC3C6;
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
  width: 150px; /* Adjust width to ensure text fits in one line */
}

.profile-menu a {
  display: block;
  padding: 10px 20px; /* Reduced padding to allow more space for text */
  color: #383838;
  text-decoration: none;
  white-space: nowrap; /* Prevents text from wrapping */
}


</style>

