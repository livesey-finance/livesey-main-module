<template>
  <div class="auth-container" @contextmenu="openConsole">
    <div class="auth-box">
      <span class="close-button" @click="closeModal">&times;</span>
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  data() {
    return {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      passwordFieldType: 'password',
      repeatPasswordFieldType: 'password'
    };
  },
  methods: {
    signup() {
      console.log('Signing up with', this.firstName, this.lastName, this.username, this.email, this.password);
    },
    switchToLogin() {
      this.$emit('switchToLogin');
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
    }
  }
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
  position: relative;
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
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
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
  right: 45px;
  top: 35%;
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
    right: 45px;
  }
}
</style>
