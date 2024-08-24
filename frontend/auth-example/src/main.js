import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

if (process.env.NODE_ENV === 'development') {
  require('./mocks/axiosMock');
}

createApp(App).use(router).mount('#app');
