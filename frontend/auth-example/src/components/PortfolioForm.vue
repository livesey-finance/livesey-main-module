<template>
  <div class="modal" @click.self="close">
    <div :class="['portfolio-form', { 'dark-theme': darkTheme }]">
      <div class="form-header">
        <h2>Create New Portfolio</h2>
        <button @click="close">&times;</button>
      </div>
      <form @submit.prevent="submitPortfolio">
        <label for="name">Portfolio Name</label>
        <input type="text" v-model="name" required />

        <label for="username">Unique Username</label>
        <input type="text" v-model="username" required />
        <span class="error" v-if="usernameError">{{ usernameError }}</span>

        <label for="description">Description</label>
        <textarea v-model="description"></textarea>

        <button type="submit">Add Portfolio</button>
      </form>
    </div>
  </div>
</template>

<script>
import { checkPortfolioUsername } from "@/mocks/portfolioListVue.js";

export default {
  name: "PortfolioForm",
  data() {
    return {
      name: "",
      username: "",
      description: "",
      usernameError: null,
      darkTheme: false, // Adding darkTheme to handle dark theme
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async submitPortfolio() {
      try {
        const { exists } = await checkPortfolioUsername(this.username);

        if (exists) {
          this.usernameError = "Username already exists!";
        } else {
          const newPortfolio = {
            name: this.name,
            username: this.username,
            description: this.description,
          };
          this.$emit("add", newPortfolio);
          this.resetForm();
        }
      } catch (error) {
        console.error("Error checking username:", error);
      }
    },
    resetForm() {
      this.name = "";
      this.username = "";
      this.description = "";
      this.usernameError = null;
    }
  }
};
</script>

<style scoped>
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

.portfolio-form {
  background-color: #EBEBEC;
  color: #383838;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.dark-theme .portfolio-form {
  background-color: #161b22;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0;
}

.form-header button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #383838;
}

.form-header button:hover {
  background-color: #EBEBEC;
  color: #84847C;
}

.dark-theme .form-header button {
  color: #ddd;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #383838;
}

.dark-theme label {
  color: #c9d1d9;
}

input,
textarea {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #FBF9FB;
  color: #383838;
  transition: background-color 0.3s, color 0.3s;
}

.dark-theme input,
.dark-theme textarea {
  background-color: #383838;
  border-color: #383838;
  color: #FBF9FB;
}

textarea {
  resize: none;
}

button {
  padding: 10px;
  background-color: #383838;
  color: #EBEBEC;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #7c7c7c;
  color: #EBEBEC;
}

.error {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
