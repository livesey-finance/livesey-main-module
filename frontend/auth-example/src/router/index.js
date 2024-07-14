import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import PortfolioPage from '@/views/PortfolioPage.vue';

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
    name: 'portfolio',
    component: PortfolioPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
