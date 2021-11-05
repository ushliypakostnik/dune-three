import { Module } from 'vuex';

// Types
import { IStore, ILayout, Tlanguage } from '@/models/store.ts';

// Create a new store Modules.
const Layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: {
    language: null,
  },
  getters: {
    language: (state: ILayout) => state.language,
  },
  actions: {
    changeLanguage: ({ commit }, language: Tlanguage): void => {
      commit('changeLanguage', language);
    },
  },
  mutations: {
    changeLanguage: (state: ILayout, language: Tlanguage): void => {
      state.language = language;
    },
  },
};

export default Layout;
