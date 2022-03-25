import { Module } from 'vuex';

// Types
import type {
  IStore,
  ILayout,
  TFieldPayload,
  TEventMessagePayload,
} from '@/models/store';

const initialState: ILayout = {
  isBuildingClock: false,
  buildingProgress: 0,
  isSelected: false,
  isSell: false,
  messages: [],
};

let array: Array<TEventMessagePayload> = [];

const layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isBuildingClock: (state: ILayout) => state.isBuildingClock,
    buildingProgress: (state: ILayout) => state.buildingProgress,
    isSelected: (state: ILayout) => state.isSelected,
    isSell: (state: ILayout) => state.isSell,
    messages: (state: ILayout) => state.messages,
  },

  actions: {
    setField: ({ commit }, payload: TFieldPayload): void => {
      commit('setField', payload);
    },

    showMessage: ({ commit }, payload: TEventMessagePayload): void => {
      commit('showMessage', payload);
    },

    hideMessage: ({ commit }, payload: number): void => {
      commit('hideMessage', payload);
    },

    reload: ({ commit }): void => {
      commit('reload');
    },
  },

  mutations: {
    setField: (state: ILayout, payload: TFieldPayload): void => {
      state[payload.field] = payload.value;
    },

    showMessage: (state: ILayout, payload: TEventMessagePayload): void => {
      array = state.messages;
      array.push(payload);
      state.messages = array;
    },

    hideMessage: (state: ILayout, payload: number): void => {
      array = state.messages.filter(
        (message: TEventMessagePayload) => message.id !== payload,
      );
      state.messages = array;
    },

    reload: (state: ILayout): void => {
      state.isBuildingClock = initialState.isBuildingClock;
      state.buildingProgress = initialState.buildingProgress;
      state.isSelected = initialState.isSelected;
      state.isSell = initialState.isSell;
      state.messages = initialState.messages;
    },
  },
};

export default layout;
