<template>
  <div :class="['home-container', { 'dark-theme': darkTheme }]">
    <header>
      <img :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" alt="Logo" class="logo" />
      <div class="search-container">
        <input type="text" v-model="searchQuery" @input="fetchSuggestions" placeholder="Search stocks and crypto..." />
        <ul v-if="searchQuery.length > 0" class="suggestions">
          <li v-if="suggestions.length === 0">No matchings were found</li>
          <li v-else v-for="item in suggestions.slice(0, 5)" :key="item.code" @click="selectSuggestion(item)">
            {{ item.name }} ({{ item.code }})
          </li>
        </ul>
      </div>
      <nav>
        <router-link to="/" class="active">Home</router-link>
        <router-link to="/shares">Shares</router-link>
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
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <div class="content">
      <h1>Latest News</h1>
      <div class="news-container">
        <div class="news-section">
          <h2>Cryptocurrency News</h2>
          <div class="news-carousel" @wheel="scrollHorizontally($event)">
            <div v-for="news in cryptoNews" :key="news.id" class="news-item">
              <h3>{{ news.webTitle }}</h3>
              <p>{{ formatTime(news.webPublicationDate) }}</p>
              <a :href="news.webUrl" target="_blank">Read more</a>
            </div>
          </div>
        </div>
        <div class="news-section">
          <h2>Stock Market News</h2>
          <div class="news-carousel" @wheel="scrollHorizontally($event)">
            <div v-for="news in stockNews" :key="news.id" class="news-item">
              <h3>{{ news.webTitle }}</h3>
              <p>{{ formatTime(news.webPublicationDate) }}</p>
              <a :href="news.webUrl" target="_blank">Read more</a>
            </div>
          </div>
        </div>
        <div class="news-section">
          <h2>Political News</h2>
          <div class="news-carousel" @wheel="scrollHorizontally($event)">
            <div v-for="news in politicalNews" :key="news.id" class="news-item">
              <h3>{{ news.webTitle }}</h3>
              <p>{{ formatTime(news.webPublicationDate) }}</p>
              <a :href="news.webUrl" target="_blank">Read more</a>
            </div>
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
  </div>
</template>

<script>
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  components: {
    LoginPage,
    SignupPage
  },
  data() {
    return {
      cryptoNews: [],
      stockNews: [],
      politicalNews: [],
      searchQuery: '',
      suggestions: [],
      showLogin: false,
      showSignup: false,
      showProfileMenu: false,
      darkTheme: false,
      newsUpdateInterval: null,
      isLoggedIn: false,
      user: null
    };
  },
  computed: {
    userIcon() {
      return this.user?.avatar || require('@/assets/default-user.png');
    }
  },
  methods: {
    async fetchNews(category, apiEndpoint, setNews) {
      try {
        console.log(`Fetching ${category} news from ${apiEndpoint}`);
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.response && data.response.results) {
          setNews(data.response.results);
        } else {
          console.error(`No results found for ${category} news`);
          setNews([]);
        }
        this.logAction(`Fetched ${category} news`);
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        setNews([]);
        this.logAction(`Error fetching ${category} news`, {
          error: error.message,
        });
      }
    },
    scrollHorizontally(event) {
      event.preventDefault();
      event.currentTarget.scrollLeft += event.deltaY;
    },
    async fetchSuggestions() {
      try {
        const response = await fetch(`/api/search?query=${this.searchQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.suggestions = data || [];
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
    formatTime(dateString) {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
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
    startNewsUpdate() {
      const apiKey = 'YOUR_API_KEY';
      const cryptoEndpoint = `https://content.guardianapis.com/search?tag=technology/cryptocurrencies&api-key=${apiKey}&show-fields=thumbnail`;
      const stockEndpoint = `https://content.guardianapis.com/search?tag=business/stock-markets&api-key=${apiKey}&show-fields=thumbnail`;
      const politicsEndpoint = `https://content.guardianapis.com/search?section=politics&api-key=${apiKey}&show-fields=thumbnail`;

      this.newsUpdateInterval = setInterval(() => {
        this.fetchNews('cryptocurrency', cryptoEndpoint, news => (this.cryptoNews = news));
        this.fetchNews('stock market', stockEndpoint, news => (this.stockNews = news));
        this.fetchNews('politics', politicsEndpoint, news => (this.politicalNews = news));
      }, 3 * 60 * 60 * 1000); // Update every 3 hours

      this.logAction('Started News Update Interval');
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
    const apiKey = 'YOUR_API_KEY';
    const cryptoEndpoint = `https://content.guardianapis.com/search?tag=technology/cryptocurrencies&api-key=${apiKey}&show-fields=thumbnail`;
    const stockEndpoint = `https://content.guardianapis.com/search?tag=business/stock-markets&api-key=${apiKey}&show-fields=thumbnail`;
    const politicsEndpoint = `https://content.guardianapis.com/search?section=politics&api-key=${apiKey}&show-fields=thumbnail`;

    this.fetchNews('cryptocurrency', cryptoEndpoint, news => (this.cryptoNews = news));
    this.fetchNews('stock market', stockEndpoint, news => (this.stockNews = news));
    this.fetchNews('politics', politicsEndpoint, news => (this.politicalNews = news));

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

    this.startNewsUpdate();
  },
  beforeUnmount() {
    if (this.newsUpdateInterval) {
      clearInterval(this.newsUpdateInterval);
      this.logAction('Cleared News Update Interval');
    }
  }
};
</script>




<style scoped>
.app-container {
  transition: opacity 0.3s ease;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}


.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  font-family: Arial, sans-serif;
  color: #383838;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #EBEBEC;
  color: #383838;
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

.profile-menu a:hover {
  background-color: #f6f4f0;
}

.content {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  flex-grow: 1;
}

h1 {
  text-align: left;
  margin-bottom: 20px;
}

.news-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-section {
  background-color: #EBEBEC;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.news-carousel {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 15px;
  padding-top: 15px;
}

.news-item {
  flex: 0 0 auto;
  width: 250px;
  padding: 10px;
  background-color: #FBF9FB;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.news-item:hover {
  transform: scale(1.07);
}

.news-item img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.news-item h3 {
  font-size: 1.1em;
}

.news-item p {
  font-size: 0.9em;
  color: #555;
}

.news-item a {
  display: block;
  margin-top: 10px;
  color: #1e90ff;
  text-decoration: none;
}

.news-item a:hover {
  text-decoration: underline;
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
}

@media (max-width: 768px) {
  nav {
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

  .footer-content {
    flex-direction: column;
    align-items: flex-start;
  }
  .footer-right {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}

.news-carousel::-webkit-scrollbar {
  display: none;
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

button, a{
  color: #ffffff;
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


/* Dark theme styles */
.dark-theme button {
  color: #21262d;
}

.dark-theme h2 {
  color: #BFC3C6;
}

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

.dark-theme .news-section {
  background-color: #1E2229;
}

.dark-theme .search-container input {
  background-color: #1E2229;
  color: #BFC3C6;
  border-color: #30363d;
}

.dark-theme .suggestions {
  background-color: #1E2229;
  border-color: #30363d;
}

.dark-theme .suggestions li {
  color: #BFC3C6;
}

.dark-theme .suggestions li:hover {
  background-color: #21262d;
}

.dark-theme .news-item {
  background-color: #21262d;
  color: #BFC3C6;
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
</style>