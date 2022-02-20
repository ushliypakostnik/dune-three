import { Module } from 'vuex';

// Constants
import { Names } from '@/utils/constants';

// Types
import type { IStore, IObjects, TObjectsPayload } from '@/models/store';

const initialState: IObjects = {
  isStart: true,
  objects: {
    [`${Names.plates}`]: [],
    [`${Names.walls}`]: [],
    [`${Names.station}`]: [],
  },
};

const Оbjects: Module<IObjects, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isStart: (state: IObjects) => state.isStart,
    objects: (state: IObjects) => state.objects,
  },

  actions: {
    saveObjects: ({ commit }, payload: TObjectsPayload): void => {
      commit('saveObjects', payload);
    },

    setStart: ({ commit }): void => {
      commit('setStart');
    },

    reload: ({ commit }): void => {
      commit('reload');
    },
  },

  mutations: {
    saveObjects: (state: IObjects, payload): void => {
      state.objects[payload.name] = payload.objects;
    },

    setStart: (state: IObjects): void => {
      state.isStart = false;
    },

    reload: (state: IObjects): void => {
      state.isStart = true;
      state.objects = initialState.objects;
    },
  },
};

export default Оbjects;
