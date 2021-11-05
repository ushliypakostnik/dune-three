import { Module } from 'vuex';

// Types
import { IStore, ILayout, Tlanguage, TControls } from '@/models/store.ts';

// Create a new store Modules.
const Layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: {
    language: null,
    controls: {
      camera: {
        x: null,
        y: null,
        z: null,
      },
      target: {
        x: null,
        y: null,
        z: null,
      },
    }
  },
  getters: {
    language: (state: ILayout) => state.language,
    controls: (state: ILayout) => state.controls,
  },
  actions: {
    changeLanguage: ({ commit }, language: Tlanguage): void => {
      commit('changeLanguage', language);
    },
    saveControls: ({ commit }, payload: TControls): void => {
      commit('saveControls', payload);
    },
  },
  mutations: {
    changeLanguage: (state: ILayout, language: Tlanguage): void => {
      state.language = language;
    },
    saveControls: (state: ILayout, payload: TControls): void => {
      state.controls = payload;
    },
  },
};

export default Layout;
