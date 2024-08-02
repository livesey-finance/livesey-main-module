import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'login',

    component: () => import('@/views/LoginPage.vue') 
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupPage.vue') 
  },
  {
    path: '/portfolio',
    name: 'portfolio-list',
    component: () => import('@/views/PortfolioListPage.vue') 
  },
  {
    path: '/portfolio/:username',
    name: 'portfolio-detail',
    component: () => import('@/views/PortfolioPage.vue') 
  },
  {
    path: '/shares/:code',
    name: 'shares',
    component: () => import('@/views/SharesPage.vue') 
  },
  {
    path: '/shares',
    name: 'shares-main-page',
    component: () => import('@/views/SharesMainPage.vue') 
  },
  {
    path: '/crypto/:code',
    name: 'crypto',
    component: () => import('@/views/CryptoPage.vue') 
  },
  {
    path: '/crypto',
    name: 'crypto-main-page',
    component: () => import('@/views/CryptoMainPage.vue') 
  },
  {
    path: '/calculator',
    name: 'calculator',
    component: () => import('@/views/CalculatorPage.vue') 
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue') 
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutPage.vue') 
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;