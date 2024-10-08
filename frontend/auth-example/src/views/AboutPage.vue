<template>
  <div :class="['about-container', { 'dark-theme': darkTheme }]">
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
        <router-link to="/">Home</router-link>
        <router-link to="/shares">Shares</router-link>
        <router-link to="/crypto">Crypto</router-link>
        <router-link to="/portfolio">Portfolio</router-link>
        <router-link to="/calculator">Calculator</router-link>
        <router-link to="/about" class="active">About</router-link>
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
    <main>
      <section class="section livesey">
        <h2>Livesey</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </section>
      <section class="section authors">
        <div class="author-card">
          <h2>Authors:</h2>
          <img src="@/assets/hh88.jpg" alt="Heorhii Huziuk" />
          <p>Heorhii Huziuk</p>
          <p>CEO</p>
        </div>
      </section>
      <section class="section social-media">
        <h2>Follow Us</h2>
        <div class="social-icons">
          <a href="https://github.com/livesey-finance" target="_blank">
            <img :src="darkTheme ? require('@/assets/github-mark.png') : require('@/assets/github-mark.png')" alt="GitHub" />
          </a>
          <a href="https://www.instagram.com/hhuziuk/" target="_blank">
            <img :src="darkTheme ? require('@/assets/instagram.png') : require('@/assets/instagram.png')" alt="Instagram" />
          </a>
          <a href="https://t.me/huziukh" target="_blank">
            <img :src="darkTheme ? require('@/assets/telegram.png') : require('@/assets/telegram.png')" alt="Telegram" />
          </a>
        </div>
      </section>
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
import axios from 'axios';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  components: {
    LoginPage,
    SignupPage,
  },
  data() {
    return {
      showLogin: false,
      showSignup: false,
      isLoggedIn: false, // Maintain local authentication state
      showProfileMenu: false,
      searchQuery: '',
      suggestions: [],
      darkTheme: false,
      user: null, // Store user data locally
    };
  },
  computed: {
    // If the user has a custom avatar, display it
    userIcon() {
      return this.user?.avatar || require('@/assets/default-user.png');
    },
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
      this.$router.push(`/profile/${this.user.username}`);
      this.logAction('Viewing Profile');
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      this.showProfileMenu = false;
      localStorage.removeItem('user');
      this.logAction('User Logged Out');
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
      localStorage.removeItem('user'); // Clear corrupted data
    }
  }
}
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Додаємо загальні стилі для body */
body {
  font-family: Arial, sans-serif;
  overflow-x: hidden; /* Запобігання горизонтальному прокручуванню */
}

/* Основний контейнер */
.about-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden; /* Запобігання горизонтальному прокручуванню */
  overflow-y: auto; /* Включаємо вертикальне прокручування тільки при необхідності */
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

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  flex-grow: 1;
  overflow-x: hidden; /* Запобігання горизонтальному прокручуванню */
}

.section {
  margin-top: 40px;
}

.livesey p {
  max-width: 800px;
  margin-bottom: 40px;
  font-size: 28px;
  color: #383838;
}

.livesey h2 {
  margin-bottom: 10px;
  font-size: 38px;
  color: #383838;
}

.authors {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.author-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #EBEBEC;
  padding: 20px;
  border-radius: 10px;
  width: 120%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.author-card:hover {
  transform: scale(1.07);
}

.author-card img {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.author-card h2 {
  margin-bottom: 20px;
  color: #383838;
}

.author-card p {
  margin-top: 15px;
  font-size: 22px;
  color: #383838;
}

.author-card p1 {
  margin-top: 15px;
  color: #383838;
  font-size: 15px;
}

.social-media {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-media h2 {
  color: #383838;
}

.social-icons {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.social-icons a img:hover {
  transition: 0.2s;
  transform: scale(1.1);
}

.social-icons a img {
  width: 40px;
  height: 40px;
}

.search-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
  max-width: 400px;
  position: relative;
}

.search-container input {
  padding: 10px;
  font-size: 16px;
  width: 100%;
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

.dark-theme .search-container input {
  background-color: #161b22;
  color: #BFC3C6;
  border-color: #30363d;
}

.dark-theme .suggestions li:hover {
  background-color: #21262d;
}

.dark-theme .about-container {
  background-color: #0d1117;
}

.dark-theme .livesey p {
  color: #BFC3C6;
}

.dark-theme .livesey h2 {
  color: #BFC3C6;
}

.dark-theme .author-card {
  background-color: #1E2229;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1); /* Light shadow for dark background */
  border-radius: 8px;
}

.dark-theme .suggestions {
  background-color: #161b22;
  border-color: #30363d;
}

.dark-theme .suggestions li {
  color: #BFC3C6;
}

.dark-theme .author-card h2 {
  color: #BFC3C6;
}

.dark-theme .author-card p {
  color: #BFC3C6;
}

.dark-theme .author-card p1 {
  color: #BFC3C6;
}

.dark-theme .social-media h2 {
  color: #BFC3C6;
}

.dark-theme .social-icons a img {
  filter: invert(1);
}

.dark-theme footer {
  background-color: #1E2229;
  color: #BFC3C6;
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

/* Responsive Styles */
@media (max-width: 1200px) {
  nav {
    font-size: 20px;
  }
}

@media (max-width: 992px) {
  main {
    align-items: stretch;
  }

  .author-card {
    width: 100%;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 768px) {
  nav {
    gap: 20px;
  }

  .author-card {
    width: 90%;
  }

  .livesey p {
    font-size: 24px;
  }

  .livesey h2 {
    font-size: 32px;
  }

  .author-card p {
    font-size: 20px;
  }

  .author-card h2 {
    font-size: 24px;
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

  .author-card {
    width: 100%;
  }

  .livesey p {
    font-size: 20px;
  }

  .livesey h2 {
    font-size: 28px;
  }

  .author-card p {
    font-size: 18px;
  }

  .author-card h2 {
    font-size: 22px;
  }
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

.profile-menu a:hover {
  background-color: #EBEBEC;
  color: #383838;
}

/* Responsive adjustments for search input */
@media (max-width: 768px) {
  .search-container {
    max-width: 300px;
  }
}

@media (max-width: 576px) {
  .search-container {
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .search-container {
    max-width: 200px;
  }
}
</style>
