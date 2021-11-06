import { Module } from 'vuex';

// Types
import { IStore, ILayout, Tlanguage, TControls } from '@/models/store.ts';

const initialState: ILayout = {
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
  },
  isPause: true,
};

const Layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: initialState,
  getters: {
    language: (state: ILayout) => state.language,
    controls: (state: ILayout) => state.controls,
    isPause: (state: ILayout) => state.isPause,
  },
  actions: {
    changeLanguage: ({ commit }, language: Tlanguage): void => {
      commit('changeLanguage', language);
    },
    saveControls: ({ commit }, payload: TControls): void => {
      commit('saveControls', payload);
    },
    togglePause: ({ commit }, isPause: boolean): void => {
      commit('togglePause', isPause);
    },
    reload: ({ commit }): void => {
      commit('reload');
    },
  },
  mutations: {
    changeLanguage: (state: ILayout, language: Tlanguage): void => {
      state.language = language;
    },
    saveControls: (state: ILayout, payload: TControls): void => {
      state.controls = payload;
    },
    togglePause: (state: ILayout, isPause: boolean): void => {
      state.isPause = isPause;
    },
    reload: (state: ILayout): void => {
      state.controls = initialState.controls;
      state.isPause = true;
    },
  },
};

export default Layout;
