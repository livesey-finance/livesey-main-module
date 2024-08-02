<template>
  <transition name="fade-out" @after-leave="closeModal">
    <div v-if="isModalOpen" :class="['auth-container', { 'dark-theme': darkTheme }]" @contextmenu="openConsole">
      <div class="auth-box">
        <span class="close-button" @click="startCloseModal">&times;</span>
        <img :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" alt="Logo" class="logo" />
        <h2 class="signup-title">Sign In</h2>
        <input type="text" placeholder="Username or Email" v-model="usernameOrEmail" class="auth-input" />
        <div class="password-container">
          <input :type="passwordFieldType" placeholder="Password" v-model="password" class="auth-input" />
          <span class="toggle-password" @click="togglePasswordVisibility">{{ passwordFieldType === 'password' ? 'Show' : 'Hide' }}</span>
        </div>
        <button @click="login">Sign In</button>
        <p @click="switchToSignup">I am a new user! Sign up</p>
        <p @click="googleAuth" class="google-auth">Continue with Google</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mockLogin } from '@/mocks/loginMock';

export default {
  name: 'LoginPage',
  props: {
    darkTheme: Boolean,
  },
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      passwordFieldType: 'password',
      isModalOpen: true,
    };
  },
  methods: {
    async login() {
      try {
        const response = await mockLogin(this.usernameOrEmail, this.password);
        console.log(response.message);
        this.$emit('login', response.user); // Emit user data on successful login
      } catch (error) {
        console.error(error.message);
      }
    },
    switchToSignup() {
      this.$emit('switchToSignup');
    },
    startCloseModal() {
      this.isModalOpen = false;
    },
    closeModal() {
      this.$emit('close');
    },
    openConsole(event) {
      console.log('Right click detected on LoginPage');
      console.log('Mouse event:', event);
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    googleAuth() {
      console.log('Redirecting to Google authentication...');
    },
  },
};
</script>




<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}
.auth-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #EBEBEC;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease-in-out;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #383838;
}
.close-button:hover {
  color: #84847C;
}
.logo {
  margin-bottom: 0px;
  max-width: 200px;
  transition: 0.2s;
}
.logo:hover {
  transform: scale(1.1);
}
.auth-input {
  width: 300px;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
  background-color: #FBF9FB;
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
  right: 45px;
  top: 35%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: #383838;
}
button {
  width: 300px;
  padding: 15px;
  background-color: #383838;
  color: #EBEBEC;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
}
p {
  margin-top: 20px;
  cursor: pointer;
  color: #383838;
}
p:hover {
  color: #84847C;
}
h2 {
  color: #383838;
}
@media (max-width: 480px) {
  .auth-input, .password-container, button {
    width: 100%;
  }
  .toggle-password {
    right: 45px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-out-leave-active {
  animation: fadeOut 0.5s ease-in-out forwards;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.google-auth {
  margin-top: 2px;
  cursor: pointer;
  color: #383838;
  text-align: center;
}
.google-auth:hover {
  color: #84847C;
}

.dark-theme .logo {
  max-width: 200px;
}

.dark-theme .auth-box {
  background-color: #161b22;
  color: #c9d1d9;
}
.dark-theme .auth-input {
  background-color: #30363d;
  color: #c9d1d9;
}
.dark-theme button {
  background-color: #2F4172;
  color: #ffffff;
}
.dark-theme .close-button {
  color: #ffffff;
}
.dark-theme .toggle-password {
  color: #c9d1d9;
}
.dark-theme p {
  color: #c9d1d9;
}
.dark-theme .signup-title {
  color: #c9d1d9;
}
.dark-theme button:hover {
  background-color: #134B70;
}
</style>
