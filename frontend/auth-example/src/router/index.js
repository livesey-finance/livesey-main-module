import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import PortfolioPage from '@/views/PortfolioPage.vue';
import PortfolioListPage from '@/views/PortfolioListPage.vue';
import SharesPage from '@/views/SharesPage.vue';
import SharesMainPage from '@/views/SharesMainPage.vue';
import CryptoPage from '@/views/CryptoPage.vue';
import CryptoMainPage from '@/views/CryptoMainPage.vue';
import CalculatorPage from '@/views/CalculatorPage.vue';
import HomePage from '@/views/HomePage.vue';
import AboutPage from '@/views/AboutPage.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupPage,
  },
  {
    path: '/portfolio',
    name: 'portfolio-list',
    component: PortfolioListPage,
  },
  {
    path: '/portfolio/:username',
    name: 'portfolio-detail',
    component: PortfolioPage,
  },
  {
    path: '/shares/:code',
    name: 'shares',
    component: SharesPage,
  },
  {
    path: '/shares',
    name: 'shares-main-page',
    component: SharesMainPage,
  },
  {
    path: '/crypto/:code',
    name: 'crypto',
    component: CryptoPage,
  },
  {
    path: '/crypto',
    name: 'crypto-main-page',
    component: CryptoMainPage,
  },
  {
    path: '/calculator',
    name: 'calculator',
    component: CalculatorPage,
  },
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;