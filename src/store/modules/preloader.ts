import { Module } from 'vuex';

// Types
import { IStore, IPreloader } from '@/models/store.ts';

let stateCopy;
let result;

// Create a new store Modules.
const Preloader: Module<IPreloader, IStore> = {
  namespaced: true,
  state: {
    isGameLoaded: false,

    // Textures
    isSand1Loaded: false,

    // Models

    // Audio

    // World build
    isAtmosphereBuild: false,
  },
  getters: {
    isGameLoaded: (state: IPreloader) => state.isGameLoaded,
  },
  actions: {
    preloadOrBuilt: ({ commit }, field: string): void => {
      commit('preloadOrBuilt', field);
    },
    isAllLoadedAndBuilt: ({ commit }): void => {
      commit('isAllLoadedAndBuilt');
    },
  },
  mutations: {
    preloadOrBuilt: (state: IPreloader, field: string) => {
      state[field] = true;
    },
    isAllLoadedAndBuilt: (state: IPreloader) => {
      stateCopy = Object.assign({}, state);
      delete stateCopy.isGameLoaded;
      result = Object.values(stateCopy).every(field => field === true);
      if (result) state.isGameLoaded = true;
    },
  },
};

export default Preloader;
