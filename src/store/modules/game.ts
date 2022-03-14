import { Module } from 'vuex';

// Types
import type { IStore, ILayout, TFieldPayload } from '@/models/store';

const initialState: ILayout = {
  isBuildingClock: false,
  buildingProgress: 0,
  isSelected: false,
  isSell: false,
};

const layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isBuildingClock: (state: ILayout) => state.isBuildingClock,
    buildingProgress: (state: ILayout) => state.buildingProgress,
    isSelected: (state: ILayout) => state.isSelected,
    isSell: (state: ILayout) => state.isSell,
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
      state.isBuildingClock = initialState.isBuildingClock;
      state.buildingProgress = initialState.buildingProgress;
      state.isSelected = initialState.isSelected;
      state.isSell = initialState.isSell;
    },
  },
};

export default layout;
