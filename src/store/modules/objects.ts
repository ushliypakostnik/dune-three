import { Module } from 'vuex';

// Types
import { IStore, IObjects, TObjectsPayload } from '@/models/store.ts';

// Create a new store Modules.
const Оbjects: Module<IObjects, IStore> = {
  namespaced: true,
  state: {
    objects: {
      tanks: [],
    },
  },
  getters: {
    objects: (state: IObjects) => state.objects,
  },
  actions: {
    saveObjects: ({ commit }, payload: TObjectsPayload): void => {
      commit('saveObjects', payload);
    },
  },
  mutations: {
    saveObjects: (state: IObjects, payload): void => {
      state.objects[payload.name] = payload.objects;
    },
  },
};

export default Оbjects;
