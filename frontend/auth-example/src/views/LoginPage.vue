<template>
  <div class="auth-container" @contextmenu="openConsole">
    <div class="auth-box">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h2 class="signup-title">Sign In</h2>
      <input type="text" placeholder="username or email" v-model="usernameOrEmail" class="auth-input" />
      <div class="password-container">
        <input :type="passwordFieldType" placeholder="password" v-model="password" class="auth-input" />
        <span class="toggle-password" @click="togglePasswordVisibility">{{ passwordFieldType === 'password' ? 'Show' : 'Hide' }}</span>
      </div>
      <button @click="login">Sign In</button>
      <p @click="switchToSignup">I am a new user! Sign up</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      usernameOrEmail: '',
      password: '',
      passwordFieldType: 'password',
    };
  },
  methods: {
    login() {
      console.log('Logging in with', this.usernameOrEmail, this.password);
    },
    switchToSignup() {
      this.$emit('switchToSignup');
    },
    openConsole(event) {
      console.log('Right click detected on LoginPage');
      console.log('Mouse event:', event);
    },
    togglePasswordVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
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
}
.auth-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f6f4f0;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
.logo {
  margin-bottom: 0px;
}
.auth-input {
  width: 300px;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-radius: 8px;
  background-color: #c4c4c4;
  color: #4f4f4f;
  font-size: 16px;
  box-sizing: border-box;
}
.password-container {
  position: relative;
  width: 300px;
}
.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: #4f4f4f;
}
button {
  width: 300px;
  padding: 15px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
p {
  margin-top: 20px;
  cursor: pointer;
  color: #4f4f4f;
}
h2 {
  color: #4f4f4f;
}
@media (max-width: 480px) {
  .auth-input, .password-container, button {
    width: 100%;
  }
  .toggle-password {
    right: 10px;
  }
}
</style>
