import { Module } from 'vuex';

// Types
import type { IStore, IPreloader } from '@/models/store';

const FLAG = 'isGameLoaded';

let stateCopy;
let result;

const initialState: IPreloader = {
  [`${FLAG}`]: false,

  // Textures
  concretteIsLoaded: false,
  sandIsLoaded: false,
  sand2IsLoaded: false,
  platesIsLoaded: false,
  metallIsLoaded: false,
  metall2IsLoaded: false,
  glassIsLoaded: false,

  // Models
  commandIsLoaded: false,
  stationsIsLoaded: false,
  plantsIsLoaded: false,

  // Audio
  windIsLoaded: false,
  zeroIsLoaded: false,
  sellIsLoaded: false,
  commandAudioIsLoaded: false,
  stationsAudioIsLoaded: false,
  plantsAudioIsLoaded: false,
  storagesAudioIsLoaded: false,
  factoriesAudioIsLoaded: false,

  // World build
  atmosphereIsBuild: false,
  commandIsBuild: false,
  platesIsBuild: false,
  wallsIsBuild: false,
  stationsIsBuild: false,
  plantsIsBuild: false,
};

const preloader: Module<IPreloader, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isGameLoaded: (state: IPreloader) => state[FLAG],
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
      delete stateCopy[FLAG];
      result = Object.values(stateCopy).every((field) => field === true);
      if (result) state[FLAG] = true;
    },
  },
};

export default preloader;
