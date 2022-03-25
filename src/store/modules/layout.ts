import { Module } from 'vuex';

// Types
import type { IStore, ILayout, TFieldPayload, IObjects } from '@/models/store';

// Constants
import { Names, OBJECTS, BUILDS_ALL } from '@/utils/constants';

const START_STATUS = {
  activeBuild: Names.plates,
  cash: 1000,
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
  isReload: true,
  isDesignPanel: false,
  activeBuild: START_STATUS.activeBuild,
  clock: 0,
  cash: START_STATUS.cash,
  cashLimit: null,
  energy: null,
  energyNeed: null,
  food: null,
  foodNeed: null,
  health: null,
};

let number = 0;

const layout: Module<ILayout, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    language: (state: ILayout) => state.language,
    controls: (state: ILayout) => state.controls,
    isPause: (state: ILayout) => state.isPause,
    isReload: (state: ILayout) => state.isReload,
    isDesignPanel: (state: ILayout) => state.isDesignPanel,
    activeBuild: (state: ILayout) => state.activeBuild,
    clock: (state: ILayout) => state.clock,
    cash: (state: ILayout) => state.cash,
    cashLimit: (state: ILayout) => state.cashLimit,
    energy: (state: ILayout) => state.energy,
    energyNeed: (state: ILayout) => state.energyNeed,
    food: (state: ILayout) => state.food,
    foodNeed: (state: ILayout) => state.foodNeed,
    health: (state: ILayout) => state.health,
  },

  actions: {
    setField: ({ commit }, payload: TFieldPayload): void => {
      commit('setField', payload);
    },

    balanceBase: ({ commit, rootState }): void => {
      commit(
        'balanceBase',
        JSON.parse(JSON.stringify(rootState)).objects.objects,
      );
    },

    reload: ({ commit }): void => {
      commit('reload');
    },
  },

  mutations: {
    setField: (state: ILayout, payload: TFieldPayload): void => {
      state[payload.field] = payload.value;
    },

    balanceBase: (state: ILayout, payload: IObjects): void => {
      state.cashLimit =
        payload[Names.storages].length * OBJECTS[Names.storages].gives.cash +
        state.cash;

      state.energy =
        payload[Names.stations].length * OBJECTS[Names.stations].gives.energy;

      number = 0;
      BUILDS_ALL.forEach((name) => {
        number += payload[name].length * OBJECTS[name].need.energy;
      });
      state.energyNeed = number;

      state.food =
        payload[Names.plants].length * OBJECTS[Names.plants].gives.food;

      number = 0;
      BUILDS_ALL.forEach((name) => {
        number += payload[name].length * OBJECTS[name].need.food;
      });
      state.foodNeed = number;
    },

    reload: (state: ILayout): void => {
      state.isPause = true;
      state.activeBuild = START_STATUS.activeBuild;
      state.cash = START_STATUS.cash;
      state.controls = initialState.controls;
      state.clock = initialState.clock;
      state.messages = initialState.messages;
      state.cashLimit = initialState.cashLimit;
      state.energy = initialState.energy;
      state.energyNeed = initialState.energyNeed;
      state.food = initialState.food;
      state.foodNeed = initialState.foodNeed;
      state.health = initialState.health;
    },
  },
};

export default layout;
