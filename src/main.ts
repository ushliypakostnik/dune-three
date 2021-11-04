import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import './registerServiceWorker';
import { store, key } from './store';

// Constants
import { LANGUAGES, MESSAGES } from '@/utils/constants';

const i18n = createI18n({
  legacy: true,
  locale: LANGUAGES[0].name,
  fallbackLocale: LANGUAGES[0].name,
  messages: MESSAGES,
});

createApp(App).use(i18n).use(store, key).mount('#app');
