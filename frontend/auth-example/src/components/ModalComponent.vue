<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>{{ isInPortfolio ? 'Remove from Portfolio' : 'Add to Portfolio' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="portfolio">Select Portfolio:</label>
          <select id="portfolio" v-model="selectedPortfolio">
            <option v-for="portfolio in portfolios" :key="portfolio.id" :value="portfolio.id">
              {{ portfolio.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <!-- Allowing decimal quantities by using step attribute -->
          <input type="number" id="quantity" v-model="quantity" min="0.01" step="0.01" required />
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
      quantity: 1,
    };
  },
  methods: {
    handleSubmit() {
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
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
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
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.primary {
  background-color: #007bff;
  color: white;
}

button.primary:hover {
  background-color: #0056b3;
}

button:hover {
  background-color: #f1f1f1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
