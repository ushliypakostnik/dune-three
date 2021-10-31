import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import layout from './modules/layout';

const debug : boolean = process.env.NODE_ENV !== 'production';

export default createStore({
  strict: debug,
  modules: {
    layout,
  },
  plugins: [createPersistedState()],
});
