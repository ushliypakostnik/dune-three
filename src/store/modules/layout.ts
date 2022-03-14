import { Module } from 'vuex';

// Types
import type { IStore, ILayout, TFieldPayload } from '@/models/store';

// Constants
import { Names } from '@/utils/constants';

const START_STATUS = {
  activeBuild: Names.plates,
  buildStatus: 2,
};

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
  activeBuild: START_STATUS.activeBuild,
  buildStatus: START_STATUS.buildStatus,
  cash: 10000,
};

const layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    language: (state: ILayout) => state.language,
    controls: (state: ILayout) => state.controls,
    isPause: (state: ILayout) => state.isPause,
    isDesignPanel: (state: ILayout) => state.isDesignPanel,
    activeBuild: (state: ILayout) => state.activeBuild,
    buildStatus: (state: ILayout) => state.buildStatus,
    cash: (state: ILayout) => state.cash,
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
      state.activeBuild = START_STATUS.activeBuild;
      state.buildStatus = START_STATUS.buildStatus;
      state.cash = initialState.cash;
      state.isPause = true;
    },
  },
};

export default layout;
