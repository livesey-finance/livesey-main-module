<template>
  <div class="shares-page">
    <header>
      <img :src="logoSrc" alt="Logo" class="logo" />
      <nav>
        <a href="/">Home</a>
        <a href="#" class="active">Shares</a>
        <a href="/crypto">Crypto</a>
        <a href="/portfolio">Portfolio</a>
        <a href="#">Calculator</a>
        <a href="#">About</a>
        <a @click="openLogin">Sign In</a>
        <a @click="openSignup">Sign Up</a>
      </nav>
    </header>
    <div class="content">
      <div class="company-info">
        <img :src="companyLogoSrc" alt="Company Logo" class="company-logo" />
        <div class="company-details">
          <h1>{{ companyName }}</h1>
          <h2>{{ companyCode }}</h2>
        </div>
        <button @click="togglePortfolio" :class="['portfolio-btn', { 'remove-btn': isInPortfolio }]">
          {{ isInPortfolio ? '- Remove from portfolio' : '+ Add to portfolio' }}
        </button>
      </div>
      <div class="ratios-container">
        <div class="tabs">
          <button @click="activeTab = 'debt'" :class="{ active: activeTab === 'debt' }">Debt ratios</button>
          <button @click="activeTab = 'efficiency'" :class="{ active: activeTab === 'efficiency' }">Efficiency ratios</button>
          <button @click="activeTab = 'liquidity'" :class="{ active: activeTab === 'liquidity' }">Liquidity ratios</button>
          <button @click="activeTab = 'valuation'" :class="{ active: activeTab === 'valuation' }">Valuation ratios</button>
          <button @click="activeTab = 'gearing'" :class="{ active: activeTab === 'gearing' }">Gearing ratios</button>
          <button @click="activeTab = 'other'" :class="{ active: activeTab === 'other' }">Other ratios</button>
        </div>
        <div class="ratios-content">
          <div v-if="activeTab === 'debt'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Value estimation</th>
                  <th>Normal value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in debtRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'efficiency'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Value estimation</th>
                  <th>Normal value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in efficiencyRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'liquidity'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Value estimation</th>
                  <th>Normal value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in liquidityRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'valuation'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Value estimation</th>
                  <th>Normal value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in valuationRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'gearing'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Value estimation</th>
                  <th>Normal value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in gearingRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'other'" class="ratios">
            <table class="ratios-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Value</th>
                  <th>Value estimation</th>
                  <th>Normal value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in otherRatios" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.value }}</td>
                  <td :class="getEstimationClass(ratio.estimation)">{{ ratio.estimation }}</td>
                  <td>{{ ratio.normalValue }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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
      <LoginPage @close="closeModal" @switchToSignup="openSignup" />
    </div>

    <!-- Signup Modal -->
    <div v-if="showSignup" class="modal" @click.self="closeModal">
      <SignupPage @close="closeModal" @switchToLogin="openLogin" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  name: 'SharesPage',
  components: {
    LoginPage,
    SignupPage
  },
  data() {
    return {
      isInPortfolio: false,
      activeTab: 'valuation',
      logoSrc: null,
      companyLogoSrc: null,
      companyName: 'Unknown',
      companyCode: 'unknown',
      showLogin: false,
      showSignup: false,
      valuationRatios: [],
      debtRatios: [],
      efficiencyRatios: [],
      liquidityRatios: [],
      gearingRatios: [],
      otherRatios: [],
      placeholders: ['ABC', 'ABC', 'ABC', 'ABC', 'ABC']
    };
  },
  methods: {
    togglePortfolio() {
      this.isInPortfolio = !this.isInPortfolio;
      if (this.isInPortfolio) {
        console.log('Added to portfolio');
      } else {
        console.log('Removed from portfolio');
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
    importLogo(src) {
      try {
        return require(`@/assets/${src}`);
      } catch (e) {
        return require('@/assets/default.png');
      }
    },
    async fetchCompanyDetails() {
      const companyCode = this.$route.params.code || 'unknown';
      try {
        const response = await axios.get(`/api/company-details/${companyCode}`);
        const data = response.data || {};
        this.companyName = data.name || 'Unknown';
        this.companyCode = data.code || 'unknown';
        this.companyLogoSrc = this.importLogo(data.logoSrc || 'default.png');
      } catch (error) {
        console.error('Error fetching company details:', error);
        this.companyName = 'Unknown';
        this.companyCode = 'unknown';
        this.companyLogoSrc = this.importLogo('default.png');
      }
    },
    async fetchValuationRatios() {
      try {
        const response = await axios.get('/api/valuation-ratios');
        this.valuationRatios = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching valuation ratios:', error);
        this.valuationRatios = [
          { name: 'P/E', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Forward P/E', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'PEG', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'P/S', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'P/B', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchDebtRatios() {
      try {
        const response = await axios.get('/api/debt-ratios');
        this.debtRatios = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching debt ratios:', error);
        this.debtRatios = [
          { name: 'Debt to Equity', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Interest Coverage', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchEfficiencyRatios() {
      try {
        const response = await axios.get('/api/efficiency-ratios');
        this.efficiencyRatios = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching efficiency ratios:', error);
        this.efficiencyRatios = [
          { name: 'Asset Turnover', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Inventory Turnover', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchLiquidityRatios() {
      try {
        const response = await axios.get('/api/liquidity-ratios');
        this.liquidityRatios = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching liquidity ratios:', error);
        this.liquidityRatios = [
          { name: 'Current Ratio', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Quick Ratio', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchGearingRatios() {
      try {
        const response = await axios.get('/api/gearing-ratios');
        this.gearingRatios = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching gearing ratios:', error);
        this.gearingRatios = [
          { name: 'Debt Ratio', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Equity Ratio', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchOtherRatios() {
      try {
        const response = await axios.get('/api/other-ratios');
        this.otherRatios = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching other ratios:', error);
        this.otherRatios = [
          { name: 'EPS', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Dividend Yield', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    getEstimationClass(estimation) {
      switch (estimation) {
        case 'good':
          return 'good';
        case 'normal':
          return 'normal';
        case 'overvalued':
          return 'overvalued';
        default:
          return 'not-estimated';
      }
    }
  },
  created() {
    this.logoSrc = this.importLogo('logo.png');
    this.fetchCompanyDetails();
    this.fetchValuationRatios();
    this.fetchDebtRatios();
    this.fetchEfficiencyRatios();
    this.fetchLiquidityRatios();
    this.fetchGearingRatios();
    this.fetchOtherRatios();
  }
};
</script>


<style scoped>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden; /* Hide horizontal overflow */
}

.shares-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: #333;
  width: 100%;
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
  max-width: 100%; /* Ensure logo does not overflow */
}

nav {
  display: flex;
  gap: 30px;
  margin-right: 100px;
  font-size: 22px;
}

nav a {
  text-decoration: none;
  color: #4f4f4f;
  white-space: nowrap; /* Prevent text wrapping */
}

nav a.active {
  font-weight: bold;
  color: #000;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap */
  text-align: center;
}

.company-logo {
  height: 80px;
  margin-right: 40px;
}

.company-details {
  display: flex;
  flex-direction: column;
}

.portfolio-btn {
  background-color: #4caf50;
  color: #fff;
  border: none;
  padding: 5px 10px; /* Reduced padding for smaller button */
  cursor: pointer;
  margin-left: 80px;
}

.portfolio-btn:hover {
  background-color: #45a049;
}

.portfolio-btn.remove-btn {
  background-color: #f44336; /* Red color for remove button */
}

.portfolio-btn.remove-btn:hover {
  background-color: #e53935;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap */
}

.tabs button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: #ddd;
}

.tabs button.active {
  background-color: #868B8E;
}

.ratios-content {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 23px;
  overflow-x: auto; /* Enable horizontal scrolling */
}

.ratios-content .ratios {
  width: 100%;
}

.ratios-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  table-layout: fixed; /* Fixed table layout to maintain column widths */
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

td {
  text-align: center;
}

th {
  text-align: center;
}

.good {
  color: green;
}

.normal {
  color: orange;
}

.overvalued {
  color: red;
}

.not-estimated {
  color: gray;
}

footer {
  width: 100%;
  background-color: #f6f4f0;
  padding: 20px;
  box-sizing: border-box;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* Allow items to wrap */
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  color: #4f4f4f;
  text-decoration: none;
  font-size: 20px;
}

.footer-social {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.footer-right {
  display: flex;
  gap: 20px;
  font-size: 16px;
}

.footer-right a {
  color: #4f4f4f;
  text-decoration: none;
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

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: transparent;
}

.auth-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(246, 244, 240, 0.8); /* Updated to add transparency */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  right: 50px;
  top: 35%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: #4f4f4f;
}

button {
  width: 300px;
  padding: 15px;
  background-color: #8c8c8c;
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
  margin-top: 0px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }

  nav {
    flex-direction: column;
    gap: 10px;
    margin-right: 0;
  }

  .company-info {
    flex-direction: column;
    text-align: center;
  }

  .company-logo {
    margin-right: 0;
  }

  .portfolio-btn {
    margin-left: 0;
  }

  .tabs {
    justify-content: center;
  }

  .footer-content {
    flex-direction: column;
    align-items: center;
  }

  .footer-left {
    align-items: center;
  }

  .footer-right {
    flex-direction: column;
    align-items: center;
  }
}
</style>
