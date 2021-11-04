import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import layout from '@/store/modules/layout';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    count: number;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

// define your typings for the store state
export interface State {
  count: number;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const debug: boolean = process.env.NODE_ENV !== 'production';

export const store = createStore<State>({
  strict: debug,
  modules: {
    layout,
  },
  plugins: [createPersistedState()],
});
