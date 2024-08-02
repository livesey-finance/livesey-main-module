<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Close Button -->
      <button class="close-button" @click="closeModal">×</button>
      <h3>{{ isInPortfolio ? 'Remove from Portfolio' : 'Add to Portfolio' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="portfolio">Select Portfolio:</label>
          <select id="portfolio" v-model="selectedPortfolio" required>
            <option v-for="portfolio in portfolios" :key="portfolio.id" :value="portfolio.id">
              {{ portfolio.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            v-model.number="quantity"
            min="0.0000001"
            step="any"
            placeholder="Enter quantity"
            required
          />
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn primary">{{ isInPortfolio ? 'Remove' : 'Add' }}</button>
          <button type="button" class="btn" @click="closeModal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    isInPortfolio: Boolean,
    portfolios: Array,
  },
  data() {
    return {
      selectedPortfolio: null,
      quantity: '',
    };
  },
  methods: {
    handleSubmit() {
      if (this.quantity <= 0.0000001 || this.quantity === '') {
        alert("Please enter a quantity greater than 0.0000001");
        return;
      }
      this.$emit('confirm', { portfolioId: this.selectedPortfolio, quantity: this.quantity });
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
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

.modal-content {
  position: relative;
  background: #EBEBEC;
  color: #383838;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.modal-content:hover {
  transform: scale(1.03);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="number"],
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  color: #EBEBEC;
  background-color: #7c7c7c;
  outline: none;
}

button:hover {
  background-color: #383838;
  transition: 0.2s;
}

button.primary {
  background-color: #383838;
}

button.primary:hover {
  background-color: #7c7c7c;
}

/* Dark theme styles */
.dark-theme .modal-content {
  background: #161b22;
  color: #c9d1d9;
}

.dark-theme button {
  background-color: #383838;
}

.dark-theme button:hover {
  background-color: #7c7c7c;
}
</style>
