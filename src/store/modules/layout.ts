import { Module } from 'vuex';

// Types
import { IStore, ILayout, TFieldPayload } from '@/models/store';

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
  isDesignPanel: false,
};

const Layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    language: (state: ILayout) => state.language,
    controls: (state: ILayout) => state.controls,
    isPause: (state: ILayout) => state.isPause,
    isDesignPanel: (state: ILayout) => state.isDesignPanel,
  },

  actions: {
    setField: ({ commit }, payload: TFieldPayload): void => {
      commit('setField', payload);
    },

    reload: ({ commit }): void => {
      commit('reload');
    },
  },

  mutations: {
    setField: (state: ILayout, payload: TFieldPayload): void => {
      state[payload.field] = payload.value;
    },

    reload: (state: ILayout): void => {
      state.controls = initialState.controls;
      state.isPause = true;
    },
  },
};

export default Layout;
