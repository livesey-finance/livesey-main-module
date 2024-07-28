<template>
  <div class="portfolio-form">
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
.portfolio-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

textarea {
  resize: none;
}

button {
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #444;
}

.error {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
