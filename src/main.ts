import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import { store, key } from './store';

// Constants
import { LANGUAGES, MESSAGES } from '@/utils/constants';

const i18n = createI18n({
  legacy: true,
  locale: store.getters['layout/language']
    ? store.getters['layout/language']
    : LANGUAGES[0],
  fallbackLocale: LANGUAGES[0],
  messages: MESSAGES,
});

createApp(App).use(i18n).use(store, key).mount('#app');
