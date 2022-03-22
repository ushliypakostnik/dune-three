import { Module } from 'vuex';

// Constants
import { Names } from '@/utils/constants';

// Utils
import { getGridKey } from '@/utils/utilities';

// Types
import type {
  IStore,
  IObjects,
  TObjectsPayload,
  TFieldPayload,
  TSellPayload,
} from '@/models/store';
import { TPosition } from '@/models/utils';

const initialState: IObjects = {
  isStart: true,
  grid: {},
  objects: {
    // Atmosphere
    [`${Names.stones}`]: [],
    [`${Names.sands}`]: [],
    [`${Names.spices}`]: [],

    // Builds
    [`${Names.command}`]: [],
    [`${Names.plates}`]: [],
    [`${Names.walls}`]: [],
    [`${Names.stations}`]: [],
    [`${Names.plants}`]: [],
  },
};

let position: TPosition = { x: 0, z: 0 };
let array: string[] = [];
let array2: string[] = [];

const objects: Module<IObjects, IStore> = {
  namespaced: true,
  state: initialState,

  getters: {
    isStart: (state: IObjects) => state.isStart,
    grid: (state: IObjects) => state.grid,
    objects: (state: IObjects) => state.objects,
  },

  actions: {
    saveObjects: ({ commit }, payload: TObjectsPayload): void => {
      commit('saveObjects', payload);
    },

    sellField: ({ commit }, payload: TSellPayload): void => {
      commit('sellField', payload);
    },

    setField: ({ commit }, payload: TFieldPayload): void => {
      commit('setField', payload);
    },

    reload: ({ commit }): void => {
      commit('reload');
    },
  },

  mutations: {
    saveObjects: (state: IObjects, payload: TObjectsPayload): void => {
      state.objects[payload.name] = payload.objects;
    },

    sellField: (state: IObjects, payload: TSellPayload): void => {
      position = { x: payload.x, z: payload.z };
      if (
        Object.prototype.hasOwnProperty.call(state.grid, getGridKey(position))
      ) {
        array = state.grid[getGridKey(position)];
        array2 = [];
        array.forEach((name) => {
          if (name !== payload.name) array2.push(name);
        });
        state.grid[getGridKey(position)] = array2;
      }
    },

    setField: (state: IObjects, payload: TFieldPayload): void => {
      if (payload.field === 'grid') {
        position = { x: payload.value.position.x, z: payload.value.position.z };
        if (
          Object.prototype.hasOwnProperty.call(
            state.grid,
            getGridKey(position),
          ) &&
          !state.grid[getGridKey(position)].includes(payload.value.name)
        )
          state.grid[getGridKey(position)].push(payload.value.name);
        else state.grid[getGridKey(position)] = [payload.value.name];
      } else if (payload.field === 'grids') {
        state.grid = payload.value;
      } else state[payload.field] = payload.value;
    },

    reload: (state: IObjects): void => {
      state.isStart = true;
      state.grid = {};
      state.objects = initialState.objects;
    },
  },
};

export default objects;
