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
      <h1>Stock Quotes</h1>
      <div class="switch-container">
        <button @click="activeSection = 'price'" :class="{ active: activeSection === 'price' }">Price</button>
        <button @click="activeSection = 'fundamental'" :class="{ active: activeSection === 'fundamental' }">Fundamental</button>
      </div>
      <div v-if="activeSection === 'price'" class="shares-table-container">
        <SharesTable :data="priceData" :additionalFields="['Last', 'High', 'Low', 'Change', 'Change%', 'Volume', 'Time']" />
      </div>
      <div v-else class="shares-table-container">
        <SharesTable :data="fundamentalData" :additionalFields="['Market Cap', 'Revenue', 'P/E Ratio', 'EPS', 'Beta']" />
      </div>
      <div class="side-panel">
        <div class="side-category">
          <h3>Top 10:</h3>
          <button @click="activeCategory = 'gainers'" :class="{ active: activeCategory === 'gainers' }">Gainers %</button>
          <button @click="activeCategory = 'losers'" :class="{ active: activeCategory === 'losers' }">Losers %</button>
        </div>
        <div v-if="activeCategory === 'gainers'" class="side-content">
          <ul>
            <li v-for="gainer in gainers" :key="gainer.code">
              {{ gainer.code }} - {{ gainer.changePercent }}
            </li>
          </ul>
        </div>
        <div v-else class="side-content">
          <ul>
            <li v-for="loser in losers" :key="loser.code">
              {{ loser.code }} - {{ loser.changePercent }}
            </li>
          </ul>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SharesPage',
  components: {
    SharesTable: {
      props: {
        data: Array,
        additionalFields: {
          type: Array,
          default: () => []
        }
      },
      data() {
        return {
          currentSort: 'name',
          currentSortDir: 'asc'
        };
      },
      computed: {
        sortedData() {
          return [...this.data].sort((a, b) => {
            let modifier = this.currentSortDir === 'asc' ? 1 : -1;
            if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
            if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
            return 0;
          });
        }
      },
      methods: {
        sortBy(sortKey) {
          if (this.currentSort === sortKey) {
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
          } else {
            this.currentSortDir = 'asc';
          }
          this.currentSort = sortKey;
        }
      },
      template: `
        <div class="shares-table">
          <table>
            <thead>
              <tr>
                <th @click="sortBy('name')">Name</th>
                <th @click="sortBy('code')">Code</th>
                <th v-for="(field, index) in additionalFields" :key="index">{{ field }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="share in sortedData" :key="share.code">
                <td>{{ share.name || 'Unknown' }}</td>
                <td>{{ share.code || 'Unknown' }}</td>
                <td v-for="(field, index) in additionalFields" :key="index">{{ share[field.toLowerCase().replace(/ /g, '')] || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    }
  },
  data() {
    return {
      activeSection: 'price',
      activeCategory: 'gainers',
      logoSrc: null,
      showLogin: false,
      showSignup: false,
      priceData: [
        { name: 'Apple', code: 'AAPL', last: 150, high: 155, low: 148, change: 1.5, changepercent: '1.01%', volume: 5000, time: '10:30 AM' },
        { name: 'Microsoft', code: 'MSFT', last: 300, high: 305, low: 295, change: -2, changepercent: '-0.67%', volume: 3000, time: '10:30 AM' }
      ],
      fundamentalData: [
        { name: 'Apple', code: 'AAPL', marketcap: '2T', revenue: '365B', peratio: 28, eps: 5.11, beta: 1.2 },
        { name: 'Microsoft', code: 'MSFT', marketcap: '1.8T', revenue: '168B', peratio: 35, eps: 8.05, beta: 0.98 }
      ],
      gainers: [
        { code: 'AAPL', changePercent: '1.01%' },
        { code: 'GOOGL', changePercent: '0.85%' }
      ],
      losers: [
        { code: 'MSFT', changePercent: '-0.67%' },
        { code: 'AMZN', changePercent: '-0.55%' }
      ]
    };
  },
  methods: {
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
    async fetchSharesData() {
      try {
        const response = await axios.get('/api/shares');
        this.priceData = response.data.price || [];
        this.fundamentalData = response.data.fundamental || [];
        this.gainers = response.data.gainers || [];
        this.losers = response.data.losers || [];
      } catch (error) {
        console.error('Error fetching shares data:', error);
        this.priceData = [];
        this.fundamentalData = [];
        this.gainers = [];
        this.losers = [];
      }
    }
  },
  created() {
    this.logoSrc = this.importLogo('logo.png');
    this.fetchSharesData();
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
  overflow-x: hidden;
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
  max-width: 100%;
}

nav {
  display: flex;
  gap: 30px;
  margin-right: 100px;
  font-size: 22px;
}

nav a {
  color: #000;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
}

nav a:hover {
  background-color: #fff;
  transition: 0.2s;
}

nav a.active {
  background-color: #333;
  color: #fff;
  transition: 0.2s;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.switch-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.switch-container button {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.switch-container button.active {
  background-color: #333;
  color: #fff;
}

.shares-table-container {
  width: 80%;
}

.shares-table table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.shares-table th, .shares-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.shares-table th {
  background-color: #f0f0f0;
}

.shares-table tbody tr:hover {
  background-color: #f9f9f9;
}

.side-panel {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.side-category {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-category button {
  padding: 10px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.side-category button.active {
  background-color: #333;
  color: #fff;
}

.side-content {
  margin-top: 20px;
}

.side-content ul {
  list-style: none;
  padding: 0;
}

.side-content li {
  margin-bottom: 10px;
}

footer {
  background-color: #333;
  color: #fff;
  padding: 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.footer-left {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.footer-social a {
  color: #fff;
  text-decoration: none;
  margin-right: 15px;
}

.footer-right a {
  color: #fff;
  text-decoration: none;
  margin-right: 15px;
}
</style>
