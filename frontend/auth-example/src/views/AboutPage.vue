<template>
  <div class="about-container">
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
        <a href="/portfolio">Portfolio</a>
        <a href="/calculator">Calculator</a>
        <a href="/about" class="active">About</a>
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
          <p1>CEO</p1>
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
      <LoginPage @close="closeModal" @switchToSignup="openSignup" @login="login" />
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal" @click.self="closeModal">
      <SignupPage @close="closeModal" @switchToLogin="openLogin" />
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
    showLogin: false,
    showSignup: false,
    isLoggedIn: false,
    showProfileMenu: false,
    userIcon: require('@/assets/default-user.png'),
    darkTheme: false,
    searchQuery: '', // Add this if not already present
    suggestions: []  // Ensure this is added
  };
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
  },
  methods: {
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
}
.dark-theme .livesey p {
  color: #c9d1d9;
}

.dark-theme .livesey h2 {
  color: #c9d1d9;
}

.livesey h2 {
  margin-bottom: 10px;
  font-size: 38px;
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
  background-color: #f0f0f0;
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
}

.author-card p {
  margin-top: 20px;
  font-size: 22px;
}
.author-card p1 {
  margin-top: 10px;
  font-size: 15px;
}

.dark-theme .author-card h2 {
  color: #c9d1d9;
}
.dark-theme .author-card p {
  color: #c9d1d9;
}
.dark-theme .author-card p1 {
  color: #c9d1d9;
}

.social-media {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dark-theme .social-media h2 {
  color: #c9d1d9;
}

.social-icons {
  display: flex;
  gap: 20px;
    margin-top: 10px;
}

.social-icons a img:hover {
  transform: scale(1.2);
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
  background-color: #161b22;
}

.dark-theme nav a:hover {
  background-color: #134B70;
}

.dark-theme nav a.active {
  background-color: #2F4172;
  color: #ffffff;
}

.dark-theme .search-container input {
  background-color: #161b22;
  color: #c9d1d9;
  border-color: #30363d;
}

.dark-theme nav a {
  color: #c9d1d9;
}

.dark-theme nav a.active {
  color: #ffffff;
}

.dark-theme .about-container {
  background-color: #0d1117;
}

.dark-theme .author-card {
  background-color: #21262d;
}

.dark-theme .social-icons a img {
  filter: invert(1);
}

.dark-theme footer {
  background-color: #1e1e1e;
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
}

</style>
