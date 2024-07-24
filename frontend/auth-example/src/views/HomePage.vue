<template>
  <div :class="['home-container', { 'dark-theme': darkTheme }]">
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
        <a href="/" class="active">Home</a>
        <a href="/shares">Shares</a>
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
        <label class="theme-toggle">
          <input type="checkbox" @change="toggleTheme" :checked="darkTheme" />
          <span class="slider"></span>
        </label>
      </nav>
    </header>
    <div class="content">
      <h1>Latest News</h1>
      <div class="news-container">
        <div class="news-section">
          <h2>Cryptocurrency News</h2>
          <div class="news-carousel" @wheel="scrollHorizontally($event)">
            <div v-for="news in cryptoNews" :key="news.id" class="news-item">
              <img v-if="news.fields.thumbnail" :src="news.fields.thumbnail" alt="News Image" />
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
              <img v-if="news.fields.thumbnail" :src="news.fields.thumbnail" alt="News Image" />
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
              <img v-if="news.fields.thumbnail" :src="news.fields.thumbnail" alt="News Image" />
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
      isLoggedIn: false,
      showProfileMenu: false,
      userIcon: require('@/assets/default-user.png'),
      darkTheme: false,
      newsUpdateInterval: null
    };
  },
  methods: {
    async fetchNews(category, setNews) {
      const apiKey = '071c8f5a-0506-470b-b57a-5903c84d8317'; 
      try {
        const response = await axios.get('https://content.guardianapis.com/search', {
          params: {
            q: category,
            'api-key': apiKey,
            'show-fields': 'thumbnail,headline',
            pageSize: 10
          }
        });
        setNews(response.data.response.results);
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        setNews([]);
      }
    },
    scrollHorizontally(event) {
      event.preventDefault();
      event.currentTarget.scrollLeft += event.deltaY;
    },
    async fetchSuggestions() {
      try {
        const response = await axios.get('/api/search', { params: { query: this.searchQuery } });
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
      console.log('Viewing profile');
    },
    logout() {
      this.isLoggedIn = false;
      this.showProfileMenu = false;
    },
    login() {
      this.isLoggedIn = true;
      this.showLogin = false;
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
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
    },
    startNewsUpdate() {
      this.newsUpdateInterval = setInterval(() => {
        this.fetchNews('cryptocurrency', news => (this.cryptoNews = news));
        this.fetchNews('stock market', news => (this.stockNews = news));
        this.fetchNews('politics', news => (this.politicalNews = news));
      }, 3 * 60 * 60 * 1000); // Update every 3 hours
    }
  },
  mounted() {
    this.fetchNews('cryptocurrency', news => (this.cryptoNews = news));
    this.fetchNews('stock market', news => (this.stockNews = news));
    this.fetchNews('politics', news => (this.politicalNews = news));

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkTheme = true;
      document.body.classList.add('dark-theme');
    } else {
      this.darkTheme = false;
      document.body.classList.remove('dark-theme');
    }

    // Start the periodic news update
    this.startNewsUpdate();
  },
  beforeUnmount() {
    if (this.newsUpdateInterval) {
      clearInterval(this.newsUpdateInterval);
    }
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  background-color: #f4f4f4;
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
  background-color: #fff;
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
}

.footer-right a {
  color: #fff;
  text-decoration: none;
  margin-right: 15px;
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

/* Dark theme styles */
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

.dark-theme .footer-logo, .dark-theme .footer-social a, .dark-theme .footer-right a {
  color: #c9d1d9;
}

button, a{
  color: #ffffff;
}

.dark-theme button {
  color: #21262d;
}


.dark-theme h2 {
  color: #c9d1d9;
}

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
.dark-theme .news-section {
  background-color: #161b22;
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

.dark-theme .news-item {
  background-color: #21262d;
  color: #c9d1d9;
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

.dark-theme .profile-menu {
  background-color: #21262d;
}
</style>