import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import PortfolioPage from '@/views/PortfolioPage.vue';
import SharesPage from '@/views/SharesPage.vue';

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
  {
    path: '/shares',
    name: 'shares',
    component: SharesPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
