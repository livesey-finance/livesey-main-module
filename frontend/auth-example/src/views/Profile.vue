<template>
  <div :class="['profile-container', { 'dark-theme': darkTheme }]">
    <header>
      <img :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" alt="Logo" class="logo" />
      <nav>
        <router-link to="/">Home</router-link>
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

    <main>
      <div class="profile-card">
        <div class="avatar-container">
          <img :src="user.avatar || defaultAvatar" alt="User Avatar" class="avatar" />
          <input type="file" @change="onFileChange" accept="image/jpeg, image/png" id="avatar-upload" class="file-input" />
          <label for="avatar-upload" class="change-avatar-btn">Change avatar</label>
        </div>
        <div class="user-details">
          <div class="detail">
            <label for="first-name">First Name:</label>
            <input type="text" id="first-name" v-model="user.firstName" :disabled="!isEditing.firstName" />
            <button @click="isEditing.firstName = true">Change first name</button>
          </div>
          <div class="detail">
            <label for="last-name">Last Name:</label>
            <input type="text" id="last-name" v-model="user.lastName" :disabled="!isEditing.lastName" />
            <button @click="isEditing.lastName = true">Change last name</button>
          </div>
          <div class="detail">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="user.email" disabled />
          </div>
          <div class="detail">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="user.username" disabled />
          </div>
          <div class="detail">
            <label for="password">Password:</label>
            <div class="password-container">
              <input :type="passwordFieldType" id="password" v-model="user.password" :disabled="!isEditing.password" />
              <span class="toggle-password" @click="togglePasswordVisibility">{{ passwordFieldType === 'password' ? 'Show' : 'Hide' }}</span>
            </div>
            <button @click="isEditing.password = true">Change password</button>
          </div>
          <button class="approve-changes-btn" @click="approveChanges">Approve Changes</button>
        </div>
      </div>
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
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      user: {
        avatar: '',
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
      },
      defaultAvatar: require('@/assets/default-user.png'),
      darkTheme: false,
      isLoggedIn: false,
      showProfileMenu: false,
      isEditing: {
        firstName: false,
        lastName: false,
        password: false
      },
      passwordFieldType: 'password'
    };
  },
  computed: {
    userIcon() {
      return this.user.avatar || this.defaultAvatar;
    },
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.avatar = e.target.result;
          this.saveAvatarUrl(this.user.avatar);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file (jpg/jpeg/png).');
      }
    },
    saveAvatarUrl(avatarUrl) {
      console.log('Saving avatar URL:', avatarUrl);
      // Placeholder for backend call to save the avatar URL
      // Simulating backend save
      localStorage.setItem('user', JSON.stringify(this.user));
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
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    viewProfile() {
      if (this.user) {
        this.$router.push(`/profile/${this.user.username}`);
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.user = {
        avatar: '',
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
      };
      this.showProfileMenu = false;
      localStorage.removeItem('user');
      this.$router.push('/'); // Redirect to home after logout
    },
    openLogin() {
      // Implement login modal
    },
    openSignup() {
      // Implement signup modal
    },
    changeFirstName() {
      this.isEditing.firstName = true;
    },
    changeLastName() {
      this.isEditing.lastName = true;
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    approveChanges() {
      // Placeholder for backend call to save user details
      console.log('Changes approved');
      localStorage.setItem('user', JSON.stringify(this.user));
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
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  }
};
</script>

<style scoped>
/* Styles for the profile page */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}

.profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
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
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px; /* Increase padding */
  flex-grow: 1;
  overflow-x: hidden;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #EBEBEC;
  color: #383838;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 600px; /* Increase width */
  font-size: 16px; /* Increase font size */
  transition: background-color 0.3s, box-shadow 0.3s;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  transition: 0.2s;
}

.avatar:hover {
  transform: scale(1.1);
}

.file-input {
  display: none;
}

.change-avatar-btn {
  padding: 5px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  background-color: #7c7c7c;
  color: #EBEBEC;
}

.change-avatar-btn:hover {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail label {
  font-size: 16px;
  font-weight: bold;
}

.detail input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.detail button {
  align-self: flex-end;
  margin-top: 5px;
  padding: 8px 12px;
  transition: 0.2s;
  background-color: #7c7c7c;
  color: #EBEBEC;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.detail button:hover {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
}

.approve-changes-btn {
  align-self: center;
  padding: 10px 20px;
  transition: 0.2s;
  background-color: #7c7c7c;
  color: #EBEBEC;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px; /* Increase font size */
  margin-top: 20px;
}

.approve-changes-btn:hover {
  background-color: #383838;
  color: #EBEBEC;
  transition: 0.2s;
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

.dark-theme .profile-card {
  background-color: #1E2229;
}

.dark-theme .profile-card p {
  color: #BFC3C6;
}

.dark-theme footer {
  background-color: #1E2229;
  color: #BFC3C6;
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

.dark-theme nav a {
  color: #BFC3C6;
}

.dark-theme nav a.active {
  color: #ffffff;
}

.dark-theme .profile-card {
  background-color: #21262d;
  color: #BFC3C6;
}

.dark-theme .detail input {
  background-color: #30363d;
  border: 1px solid #1e2229;
  color: #BFC3C6;
}

.dark-theme .change-avatar-btn {
  color: #383838;
  background-color: #EBEBEC;
}

.dark-theme .change-avatar-btn:hover {
  background-color: #383838;
  color: #EBEBEC;
}

.dark-theme .detail button {
  color: #383838;
  background-color: #EBEBEC;
}

.dark-theme .detail button:hover {
  background-color: #383838;
  color: #EBEBEC;
}

.dark-theme .approve-changes-btn {
  color: #383838;
  background-color: #EBEBEC;
}

.dark-theme .approve-changes-btn:hover {
  background-color: #383838;
  color: #EBEBEC;
}


.password-container {
  position: relative;
  width: 100%;
}
.password-container input {
  width: 100%;
}
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: #383838;
}

.dark-theme .toggle-password {
  color: #BFC3C6;
}
.dark-theme .toggle-password:active {
  color: #84847C;
}
</style>
