import { Module } from 'vuex';

// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { IStore, IObjects, TObjectsPayload } from '@/models/store.ts';

const initialState: IObjects = {
  objects: {
    [`${OBJECTS.STORE.PLAYERUNITS.name}`]: [],
  },
};

const Оbjects: Module<IObjects, IStore> = {
  namespaced: true,
  state: initialState,
  getters: {
    objects: (state: IObjects) => state.objects,
  },
  actions: {
    saveObjects: ({ commit }, payload: TObjectsPayload): void => {
      commit('saveObjects', payload);
    },
    reload: ({ commit }): void => {
      commit('reload');
    },
  },
  mutations: {
    saveObjects: (state: IObjects, payload): void => {
      state.objects[payload.name] = payload.objects;
    },
    reload: (state: IObjects): void => {
      state.objects = initialState.objects;
    },
  },
};

export default Оbjects;
