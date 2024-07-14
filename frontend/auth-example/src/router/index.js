import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
