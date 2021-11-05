import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import preloader from '@/store/modules/preloader';
import layout from '@/store/modules/layout';
import objects from '@/store/modules/objects';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    name: string;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

// define your typings for the store state
export interface State {
  name: string;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

const debug: boolean = process.env.NODE_ENV !== 'production';

export const store = createStore<State>({
  strict: debug,
  state: {
    name: 'store',
  },
  modules: {
    preloader,
    layout,
    objects,
  },
  plugins: [createPersistedState({
    paths: ['layout', 'objects'],
  })],
});
