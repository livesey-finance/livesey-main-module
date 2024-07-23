// theme.js
import { reactive } from 'vue';

export const themeState = reactive({
  darkTheme: localStorage.getItem('theme') === 'dark',
});

export const toggleTheme = () => {
  themeState.darkTheme = !themeState.darkTheme;
  document.body.classList.toggle('dark-theme', themeState.darkTheme);
  localStorage.setItem('theme', themeState.darkTheme ? 'dark' : 'light');
};

// Apply the theme on initial load
if (themeState.darkTheme) {
  document.body.classList.add('dark-theme');
}