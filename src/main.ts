import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import './registerServiceWorker';
import { store, key } from './store';

// Constants
import { LANGUAGES, DESIGN, MESSAGES } from '@/utils/constants';

const i18n = createI18n({
  legacy: true,
  locale: LANGUAGES[1].name,
  fallbackLocale: DESIGN.START_LANGUAGE,
  messages: MESSAGES,
});

i18n.global.locale = DESIGN.START_LANGUAGE;
createApp(App).use(i18n).use(store, key).mount('#app');
