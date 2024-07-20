<template>
  <div class="calculator-container">
    <header>
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <nav>
        <a href="/">Home</a>
        <a href="/shares">Shares</a>
        <a href="/crypto">Crypto</a>
        <a href="/portfolio">Portfolio</a>
        <a href="#" class="active">Calculator</a>
        <a href="/about">About</a>
        <a @click="openLogin">Sign In</a>
        <a @click="openSignup">Sign Up</a>
      </nav>
    </header>
    <div class="content">
      <div class="calculator">
        <h2>Financial Ratios Calculator</h2>
        <div class="formula-selector">
          <label for="formula">Select Formula:</label>
          <select id="formula" v-model="selectedFormula" @change="updateInputs">
            <option v-for="formula in formulas" :key="formula.id" :value="formula.id">{{ formula.name }}</option>
          </select>
        </div>
        <div v-for="(input, index) in formulaInputs" :key="index" class="input-group">
          <label :for="input.id">{{ input.label }}</label>
          <input type="number" v-model="input.value" :id="input.id" @input="validateInput(index)" />
          <p v-if="input.error" class="error-message">Invalid data</p>
        </div>
        <button @click="calculateFormula">Calculate</button>
        <div v-if="result !== null">
          <h3>Result:</h3>
          <p>{{ result }}</p>
        </div>
        <div v-if="selectedFormula">
          <h3 class="formula-header"><b>{{ getFormulaHeader(selectedFormula) }}</b></h3>
          <p class="formula-description">{{ getFormulaDescription(selectedFormula) }}</p>
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
import {
  calculateCurrentRatio,
  calculateQuickRatio,
  calculateCashRatio,
  calculateNWCPercentageRevenue,
  calculateNetDebt,
  calculatePE,
  calculateForwardPE,
  calculatePEG,
  calculatePS,
  calculatePB,
  calculatePC,
  calculatePFCF,
  calculateCAPE,
  calculateEV,
  calculateEVtoEBITDA,
  calculateEVCFO,
  calculateEVFCFF,
  calculateDebtEquity,
  calculateLTDebtEquity,
  calculateEPS,
  calculateROA,
  calculateROE,
  calculateROI,
} from "livsey-finance-library";
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

export default {
  components: {
    LoginPage,
    SignupPage
  },
  data() {
    return {
      formulas: [
        { id: 'debtEquity', name: 'Debt to Equity Ratio', inputs: ['totalDebt', 'equity'] },
        { id: 'ltDebtEquity', name: 'Long Term Debt to Equity Ratio', inputs: ['longTermDebt', 'equity'] },
        { id: 'eps', name: 'Earnings Per Share', inputs: ['netIncome', 'preferredDividends', 'sharesOutstanding'] },
        { id: 'roa', name: 'Return on Assets', inputs: ['netIncome', 'totalAssets'] },
        { id: 'roe', name: 'Return on Equity', inputs: ['netIncome', 'shareholdersEquity'] },
        { id: 'roi', name: 'Return on Investment', inputs: ['currentValue', 'cost'] },
        { id: 'currentRatio', name: 'Current Ratio', inputs: ['currentAssets', 'currentLiabilities'] },
        { id: 'quickRatio', name: 'Quick Ratio', inputs: ['currentAssets', 'inventory', 'currentLiabilities'] },
        { id: 'cashRatio', name: 'Cash Ratio', inputs: ['cash', 'currentLiabilities'] },
        { id: 'nwcPercentageRevenue', name: 'NWC Percentage Revenue', inputs: ['netWorkingCapital', 'revenue'] },
        { id: 'netDebt', name: 'Net Debt', inputs: ['totalDebt', 'cash'] },
        { id: 'pe', name: 'Price to Earnings Ratio', inputs: ['marketPrice', 'earningsPerShare'] },
        { id: 'forwardPE', name: 'Forward PE Ratio', inputs: ['marketPrice', 'estimatedEarningsPerShare'] },
        { id: 'peg', name: 'Price/Earnings to Growth Ratio', inputs: ['peRatio', 'growthRate'] },
        { id: 'ps', name: 'Price to Sales Ratio', inputs: ['marketPrice', 'salesPerShare'] },
        { id: 'pb', name: 'Price to Book Ratio', inputs: ['marketPrice', 'bookValuePerShare'] },
        { id: 'pc', name: 'Price to Cash Flow Ratio', inputs: ['marketPrice', 'cashFlowPerShare'] },
        { id: 'pfcf', name: 'Price to Free Cash Flow Ratio', inputs: ['marketPrice', 'freeCashFlowPerShare'] },
        { id: 'cape', name: 'Cyclically Adjusted PE Ratio', inputs: ['marketPrice', 'averageInflationAdjustedEarnings'] },
        { id: 'ev', name: 'Enterprise Value', inputs: ['marketCapitalization', 'totalDebt', 'cash'] },
        { id: 'evToEbitda', name: 'EV/EBITDA Ratio', inputs: ['enterpriseValue', 'ebitda'] },
        { id: 'evCFO', name: 'EV/CFO Ratio', inputs: ['enterpriseValue', 'cashFlowFromOperations'] },
        { id: 'evFCFF', name: 'EV/FCFF Ratio', inputs: ['enterpriseValue', 'freeCashFlowToFirm'] },
      ],
      selectedFormula: 'debtEquity',
      inputs: {
        totalDebt: { id: 'totalDebt', label: 'Total Debt', value: null, error: false },
        equity: { id: 'equity', label: 'Equity', value: null, error: false },
        longTermDebt: { id: 'longTermDebt', label: 'Long Term Debt', value: null, error: false },
        netIncome: { id: 'netIncome', label: 'Net Income', value: null, error: false },
        preferredDividends: { id: 'preferredDividends', label: 'Preferred Dividends', value: null, error: false },
        sharesOutstanding: { id: 'sharesOutstanding', label: 'Shares Outstanding', value: null, error: false },
        totalAssets: { id: 'totalAssets', label: 'Total Assets', value: null, error: false },
        shareholdersEquity: { id: 'shareholdersEquity', label: 'Shareholders\' Equity', value: null, error: false },
        currentValue: { id: 'currentValue', label: 'Current Value', value: null, error: false },
        cost: { id: 'cost', label: 'Cost', value: null, error: false },
        currentAssets: { id: 'currentAssets', label: 'Current Assets', value: null, error: false },
        currentLiabilities: { id: 'currentLiabilities', label: 'Current Liabilities', value: null, error: false },
        inventory: { id: 'inventory', label: 'Inventory', value: null, error: false },
        cash: { id: 'cash', label: 'Cash', value: null, error: false },
        netWorkingCapital: { id: 'netWorkingCapital', label: 'Net Working Capital', value: null, error: false },
        revenue: { id: 'revenue', label: 'Revenue', value: null, error: false },
        marketPrice: { id: 'marketPrice', label: 'Market Price', value: null, error: false },
        earningsPerShare: { id: 'earningsPerShare', label: 'Earnings Per Share', value: null, error: false },
        estimatedEarningsPerShare: { id: 'estimatedEarningsPerShare', label: 'Estimated Earnings Per Share', value: null, error: false },
        peRatio: { id: 'peRatio', label: 'PE Ratio', value: null, error: false },
        growthRate: { id: 'growthRate', label: 'Growth Rate', value: null, error: false },
        salesPerShare: { id: 'salesPerShare', label: 'Sales Per Share', value: null, error: false },
        bookValuePerShare: { id: 'bookValuePerShare', label: 'Book Value Per Share', value: null, error: false },
        cashFlowPerShare: { id: 'cashFlowPerShare', label: 'Cash Flow Per Share', value: null, error: false },
        freeCashFlowPerShare: { id: 'freeCashFlowPerShare', label: 'Free Cash Flow Per Share', value: null, error: false },
        averageInflationAdjustedEarnings: { id: 'averageInflationAdjustedEarnings', label: 'Average Inflation Adjusted Earnings', value: null, error: false },
        marketCapitalization: { id: 'marketCapitalization', label: 'Market Capitalization', value: null, error: false },
        enterpriseValue: { id: 'enterpriseValue', label: 'Enterprise Value', value: null, error: false },
        ebitda: { id: 'ebitda', label: 'EBITDA', value: null, error: false },
        cashFlowFromOperations: { id: 'cashFlowFromOperations', label: 'Cash Flow From Operations', value: null, error: false },
        freeCashFlowToFirm: { id: 'freeCashFlowToFirm', label: 'Free Cash Flow To Firm', value: null, error: false },
      },
      formulaInputs: [],
      result: null,
      showLogin: false,
      showSignup: false,
    };
  },
  methods: {
    updateInputs() {
      const selected = this.formulas.find(formula => formula.id === this.selectedFormula);
      this.formulaInputs = selected.inputs.map(inputId => this.inputs[inputId]);
    },
    calculateFormula() {
      const inputValues = this.formulaInputs.map(input => input.value);
      if (this.formulaInputs.some(input => input.error) || inputValues.some(value => value === 0)) {
        this.result = "Invalid data or division by zero";
        return;
      }
      switch (this.selectedFormula) {
        case 'debtEquity':
          this.result = calculateDebtEquity(...inputValues);
          break;
        case 'ltDebtEquity':
          this.result = calculateLTDebtEquity(...inputValues);
          break;
        case 'eps':
          this.result = calculateEPS(...inputValues);
          break;
        case 'roa':
          this.result = calculateROA(...inputValues);
          break;
        case 'roe':
          this.result = calculateROE(...inputValues);
          break;
        case 'roi':
          this.result = calculateROI(...inputValues);
          break;
        case 'currentRatio':
          this.result = calculateCurrentRatio(...inputValues);
          break;
        case 'quickRatio':
          this.result = calculateQuickRatio(...inputValues);
          break;
        case 'cashRatio':
          this.result = calculateCashRatio(...inputValues);
          break;
        case 'nwcPercentageRevenue':
          this.result = calculateNWCPercentageRevenue(...inputValues);
          break;
        case 'netDebt':
          this.result = calculateNetDebt(...inputValues);
          break;
        case 'pe':
          this.result = calculatePE(...inputValues);
          break;
        case 'forwardPE':
          this.result = calculateForwardPE(...inputValues);
          break;
        case 'peg':
          this.result = calculatePEG(...inputValues);
          break;
        case 'ps':
          this.result = calculatePS(...inputValues);
          break;
        case 'pb':
          this.result = calculatePB(...inputValues);
          break;
        case 'pc':
          this.result = calculatePC(...inputValues);
          break;
        case 'pfcf':
          this.result = calculatePFCF(...inputValues);
          break;
        case 'cape':
          this.result = calculateCAPE(...inputValues);
          break;
        case 'ev':
          this.result = calculateEV(...inputValues);
          break;
        case 'evToEbitda':
          this.result = calculateEVtoEBITDA(...inputValues);
          break;
        case 'evCFO':
          this.result = calculateEVCFO(...inputValues);
          break;
        case 'evFCFF':
          this.result = calculateEVFCFF(...inputValues);
          break;
        default:
          this.result = 'Invalid formula';
          break;
      }
    },
    validateInput(index) {
      const input = this.formulaInputs[index];
      input.error = isNaN(input.value) || input.value === null;
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
    getFormulaHeader(formulaId) {
      const formula = this.formulas.find(f => f.id === formulaId);
      return formula ? formula.name : '';
    },
    getFormulaDescription(formulaId) {
      // Add descriptions for each formula
      switch (formulaId) {
        case 'debtEquity':
          return 'Lorem Ipsum';
        case 'ltDebtEquity':
          return 'Lorem Ipsum';
        case 'eps':
          return 'Lorem Ipsum';
        case 'roa':
          return 'Lorem Ipsum';
        case 'roe':
          return 'Lorem Ipsum';
        case 'roi':
          return 'Lorem Ipsum';
        case 'currentRatio':
          return 'Lorem Ipsum';
        case 'quickRatio':
          return 'Lorem Ipsum';
        case 'cashRatio':
          return 'Lorem Ipsum';
        case 'nwcPercentageRevenue':
          return 'Lorem Ipsum';
        case 'netDebt':
          return 'Lorem Ipsum';
        case 'pe':
          return 'Lorem Ipsum';
        case 'forwardPE':
          return 'Lorem Ipsum';
        case 'peg':
          return 'Lorem Ipsum';
        case 'ps':
          return 'Lorem Ipsum';
        case 'pb':
          return 'Lorem Ipsum';
        case 'pc':
          return 'Lorem Ipsum';
        case 'pfcf':
          return 'Lorem Ipsum';
        case 'cape':
          return 'Lorem Ipsum';
        case 'ev':
          return 'Lorem Ipsum';
        case 'evToEbitda':
          return 'Lorem Ipsum';
        case 'evCFO':
          return 'Lorem Ipsum';
        case 'evFCFF':
          return 'Lorem Ipsum';
        default:
          return 'Lorem Ipsum';
      }
    },
    
  },
  mounted() {
    this.updateInputs();
  },
};
</script>

<style scoped>
.calculator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  justify-content: space-between;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  flex-grow: 1;
}

.calculator {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.formula-selector,
.input-group {
  margin-bottom: 20px;
}

.formula-selector select {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #A3A9A9;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #333;
  color: #fff;
  transition: 0.2s;
}

h3 {
  margin-top: 20px;
}

.formula-header {
  font-weight: bold;
  font-size: 1.2em;
}

.formula-description {
  font-size: 0.9em;
  color: #555;
}

.error-message {
  color: red;
  font-size: 0.8em;
}

footer {
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-logo {
  color: #fff;
  text-decoration: none;
  font-size: 20px;
}

.footer-social {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.footer-social a {
  color: #fff;
  text-decoration: none;
}

.footer-right {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.footer-right a {
  color: #fff;
  text-decoration: none;
  margin-right: 15px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

@media (max-width: 1200px) {
  nav {
    font-size: 20px;
  }
}

@media (max-width: 992px) {
  .content {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 768px) {
  nav {
    gap: 20px;
  }
}

@media (max-width: 576px) {
  nav {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
