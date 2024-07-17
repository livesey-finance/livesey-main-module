<template>
  <div class="crypto-page">
    <header>
      <img :src="logoSrc" alt="Logo" class="logo" />
      <nav>
        <a href="/">Home</a>
        <a href="/shares">Shares</a>
        <a href="#" class="active">Crypto</a>
        <a href="/portfolio">Portfolio</a>
        <a href="#">Calculator</a>
        <a href="#">About</a>
        <a @click="openLogin">Sign In</a>
        <a @click="openSignup">Sign Up</a>
      </nav>
    </header>
    <div class="content">
      <div class="crypto-info">
        <img :src="cryptoLogoSrc" alt="Crypto Logo" class="crypto-logo" />
        <div class="crypto-details">
          <h1>{{ cryptoName }}</h1>
          <h2>{{ cryptoCode }}</h2>
        </div>
        <button @click="togglePortfolio" :class="['portfolio-btn', { 'remove-btn': isInPortfolio }]">
          {{ isInPortfolio ? '- Remove from portfolio' : '+ Add to portfolio' }}
        </button>
      </div>
      <div class="metrics-container">
        <div class="tabs">
          <button @click="activeTab = 'general'" :class="{ active: activeTab === 'general' }">General Metrics</button>
          <button @click="activeTab = 'ratios'" :class="{ active: activeTab === 'ratios' }">Ratios & Analytics</button>
          <button @click="activeTab = 'network'" :class="{ active: activeTab === 'network' }">Network Metrics</button>
          <button @click="activeTab = 'social'" :class="{ active: activeTab === 'social' }">Social Activity</button>
          <button @click="activeTab = 'liquidity'" :class="{ active: activeTab === 'liquidity' }">Liquidity Metrics</button>
          <button @click="activeTab = 'other'" :class="{ active: activeTab === 'other' }">Other Metrics</button>
        </div>
        <div class="metrics-content">
          <div v-if="activeTab === 'general'" class="metrics">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in generalMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.description }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'ratios'" class="metrics">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ratio in ratiosMetrics" :key="ratio.name">
                  <td>{{ ratio.name }}</td>
                  <td>{{ ratio.description }}</td>
                  <td>{{ ratio.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'network'" class="metrics">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in networkMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.description }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'social'" class="metrics">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in socialMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.description }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'liquidity'" class="metrics">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in liquidityMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.description }}</td>
                  <td>{{ metric.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="activeTab === 'other'" class="metrics">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Description</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="metric in otherMetrics" :key="metric.name">
                  <td>{{ metric.name }}</td>
                  <td>{{ metric.description }}</td>
                  <td>{{ metric.value }}</td>
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
          <a href="#" class="footer-logo">CryptoApp</a>
          <div class="footer-social">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Email</a>
          </div>
        </div>
        <div class="footer-right">
          <a href="#">About Us</a>
          <a href="#">Terms of Service</a>
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
  name: 'CryptoPage',
  components: {
    LoginPage,
    SignupPage
  },
  data() {
    return {
      isInPortfolio: false,
      activeTab: 'general',
      logoSrc: null,
      cryptoLogoSrc: null,
      cryptoName: 'Unknown',
      cryptoCode: 'unknown',
      showLogin: false,
      showSignup: false,
      generalMetrics: [],
      ratiosMetrics: [],
      networkMetrics: [],
      socialMetrics: [],
      liquidityMetrics: [],
      otherMetrics: []
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
    async fetchCryptoDetails() {
      const cryptoCode = this.$route.params.code || 'unknown';
      try {
        const response = await axios.get(`/api/crypto-details/${cryptoCode}`);
        const data = response.data || {};
        this.cryptoName = data.name || 'Unknown';
        this.cryptoCode = data.code || 'unknown';
        this.cryptoLogoSrc = this.importLogo(data.logoSrc || 'default.png');
      } catch (error) {
        console.error('Error fetching crypto details:', error);
        this.cryptoName = 'Unknown';
        this.cryptoCode = 'unknown';
        this.cryptoLogoSrc = this.importLogo('default.png');
      }
    },
    async fetchGeneralMetrics() {
      try {
        const response = await axios.get('/api/general-metrics');
        this.generalMetrics = response.data.map(metric => ({
          name: metric.name || 'Unknown',
          value: metric.value || '00.00',
          estimation: metric.estimation || 'not estimated',
          normalValue: metric.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching general metrics:', error);
        this.generalMetrics = [
          { name: 'Market Cap', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Volume', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Supply', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchRatiosMetrics() {
      try {
        const response = await axios.get('/api/ratios-metrics');
        this.ratiosMetrics = response.data.map(ratio => ({
          name: ratio.name || 'Unknown',
          value: ratio.value || '00.00',
          estimation: ratio.estimation || 'not estimated',
          normalValue: ratio.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching ratios metrics:', error);
        this.ratiosMetrics = [
          { name: 'P/E', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Forward P/E', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'PEG', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'P/S', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'P/B', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchNetworkMetrics() {
      try {
        const response = await axios.get('/api/network-metrics');
        this.networkMetrics = response.data.map(metric => ({
          name: metric.name || 'Unknown',
          value: metric.value || '00.00',
          estimation: metric.estimation || 'not estimated',
          normalValue: metric.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching network metrics:', error);
        this.networkMetrics = [
          { name: 'Hash Rate', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Node Count', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchSocialMetrics() {
      try {
        const response = await axios.get('/api/social-metrics');
        this.socialMetrics = response.data.map(metric => ({
          name: metric.name || 'Unknown',
          value: metric.value || '00.00',
          estimation: metric.estimation || 'not estimated',
          normalValue: metric.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching social metrics:', error);
        this.socialMetrics = [
          { name: 'Twitter Mentions', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Reddit Activity', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchLiquidityMetrics() {
      try {
        const response = await axios.get('/api/liquidity-metrics');
        this.liquidityMetrics = response.data.map(metric => ({
          name: metric.name || 'Unknown',
          value: metric.value || '00.00',
          estimation: metric.estimation || 'not estimated',
          normalValue: metric.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching liquidity metrics:', error);
        this.liquidityMetrics = [
          { name: 'Volume 24h', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Bid-Ask Spread', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    },
    async fetchOtherMetrics() {
      try {
        const response = await axios.get('/api/other-metrics');
        this.otherMetrics = response.data.map(metric => ({
          name: metric.name || 'Unknown',
          value: metric.value || '00.00',
          estimation: metric.estimation || 'not estimated',
          normalValue: metric.normalValue || '00.00'
        }));
      } catch (error) {
        console.error('Error fetching other metrics:', error);
        this.otherMetrics = [
          { name: 'Developer Activity', value: '00.00', estimation: 'not estimated', normalValue: '00.00' },
          { name: 'Partnership Announcements', value: '00.00', estimation: 'not estimated', normalValue: '00.00' }
        ];
      }
    }
  },
  created() {
    this.logoSrc = this.importLogo('logo.png');
    this.fetchCryptoDetails();
    this.fetchGeneralMetrics();
    this.fetchRatiosMetrics();
    this.fetchNetworkMetrics();
    this.fetchSocialMetrics();
    this.fetchLiquidityMetrics();
    this.fetchOtherMetrics();
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

.crypto-page {
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

.crypto-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap; /* Allow items to wrap */
  text-align: center;
}

.crypto-logo {
  height: 80px;
  margin-right: 40px;
}

.crypto-details {
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

.metrics-content {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 23px;
  overflow-x: auto; /* Enable horizontal scrolling */
}

.metrics-content .metrics {
  width: 100%;
}

.metrics-table {
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

  .crypto-info {
    flex-direction: column;
    text-align: center;
  }

  .crypto-logo {
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