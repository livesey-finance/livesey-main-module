<template>
  <transition name="fade-out" @after-leave="closeModal">
    <div v-if="isModalOpen" :class="['auth-container', { 'dark-theme': darkTheme }]" @contextmenu="openConsole">
      <div class="auth-box">
        <span class="close-button" @click="startCloseModal">&times;</span>
        <img :src="darkTheme ? require('@/assets/logo-dark.png') : require('@/assets/logo.png')" alt="Logo" class="logo" />
        <h2 class="signup-title">Sign Up</h2>
        <input type="text" placeholder="First name" v-model="firstName" class="auth-input" />
        <input type="text" placeholder="Last name" v-model="lastName" class="auth-input" />
        <input type="text" placeholder="Username" v-model="username" class="auth-input" />
        <input type="email" placeholder="Email" v-model="email" class="auth-input" />
        <div class="password-container">
          <input :type="passwordFieldType" placeholder="Password" v-model="password" class="auth-input" />
          <span class="toggle-password" @click="togglePasswordVisibility">{{ passwordFieldType === 'password' ? 'Show' : 'Hide' }}</span>
        </div>
        <div class="password-container">
          <input :type="repeatPasswordFieldType" placeholder="Repeat your password" v-model="repeatPassword" class="auth-input" />
          <span class="toggle-password" @click="toggleRepeatPasswordVisibility">{{ repeatPasswordFieldType === 'password' ? 'Show' : 'Hide' }}</span>
        </div>
        <button @click="signup">Sign Up</button>
        <p @click="switchToLogin">I already have an account! Sign in</p>
        <p @click="googleAuth" class="google-auth">Continue with Google</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mockSignUp } from '@/mocks/signUpMock';
export default {
  name: 'SignupPage',
  props: {
    darkTheme: Boolean,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      passwordFieldType: 'password',
      repeatPasswordFieldType: 'password',
      isModalOpen: true,
    };
  },
  methods: {
    async signup() {
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        email: this.email,
        password: this.password,
        repeatPassword: this.repeatPassword,
      };

      try {
        const response = await mockSignUp(userData);
        console.log(response.message);
        this.$emit('signup', response.user); // Передаємо інформацію про користувача
        alert(response.message); // Відображення повідомлення про успіх
      } catch (error) {
        console.error(error.message);
        alert(error.message); // Відображення повідомлення про помилку
      }
    },
    switchToLogin() {
      this.$emit('switchToLogin');
    },
    startCloseModal() {
      this.isModalOpen = false;
    },
    closeModal() {
      this.$emit('close');
    },
    openConsole(event) {
      console.log('Right click detected on SignupPage');
      console.log('Mouse event:', event);
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    toggleRepeatPasswordVisibility() {
      this.repeatPasswordFieldType = this.repeatPasswordFieldType === 'password' ? 'text' : 'password';
    },
    googleAuth() {
      console.log('Redirecting to Google authentication...');
    }
  }
};
</script>


<style scoped>
.shares-table {
  width: 100%;
}

.shares-table table {
  width: 100%;
  border-collapse: collapse;
}

.shares-table th,
.shares-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.shares-table th {
  background-color: #f0f0f0;
  position: relative;
}

.shares-table th.sortable {
  cursor: pointer;
}

.shares-table th span {
  margin-left: 5px;
}

/* Dark theme styles */
.shares-table.dark-theme th,
.shares-table.dark-theme td {
  background-color: #161b22;
  color: #c9d1d9;
  border-bottom: 1px solid #30363d;
}

.shares-table.dark-theme th {
  background-color: #21262d;
  color: #c9d1d9;
  border-bottom: 1px solid #30363d;
  border-top: 1px solid #30363d;
}
</style>
