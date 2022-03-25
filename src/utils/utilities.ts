// Useful functions
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Names, Textures, Audios, DESIGN, OBJECTS } from '@/utils/constants';

// Types
import type { TPosition, TPositions } from '@/models/utils';
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { Vector3, BoxBufferGeometry } from 'three';

// String with pad length
export const paddy = (number: number, padlen = 3, padchar = '0'): string => {
  const pad = new Array(1 + padlen).join(padchar);
  return (pad + number).slice(-pad.length);
};

// Math

export const yesOrNo = (): boolean => Math.random() >= 0.5;

export const plusOrMinus = (): number => {
  return Math.random() >= 0.5 ? 1 : -1;
};

export const randomInteger = (min: number, max: number): number => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const distance2D = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

// Get number sign?
export const getSign = (number: number): string => {
  return number >= 0 ? '+' : '-';
};

// Get key for grid
export const getGridKey = (position: TPosition): string => {
  return `${getSign(position.x)}${paddy(Math.abs(position.x))}.${getSign(
    position.z,
  )}${paddy(Math.abs(position.z))}`;
};

// Получить координаты в сетке по вектору
export const coordsFromVector = (vector: Vector3): TPosition => {
  return {
    x: vector.x / DESIGN.CELL,
    z: vector.z / DESIGN.CELL,
  };
};

export const getRandomPosition = (
  centerX: number,
  centerZ: number,
  radius: number,
  isSafeCenter: boolean,
): TPosition => {
  const safe = isSafeCenter ? 15 : 7;
  const a = plusOrMinus();
  const b = plusOrMinus();
  return {
    x: Math.round(centerX + Math.random() * a * radius) + safe * a,
    z: Math.round(centerZ + Math.random() * b * radius) + safe * b,
  };
};

const isBadPosition = (
  positions: TPositions,
  position: TPosition,
  distance: number,
): boolean => {
  return !!positions.find(
    (place: TPosition) =>
      distance2D(place.x, place.z, position.x, position.z) < distance,
  );
};

export const isNotStartPlates = (position: TPosition): boolean => {
  return DESIGN.START[Names.plates].every(
    (item: TPosition) => !(item.x === position.x && item.z === position.z),
  );
};

export const getUniqueRandomPosition = (
  positions: TPositions,
  centerX: number,
  centerZ: number,
  distance: number,
  radius: number,
  isSafeCenter: boolean,
): TPosition => {
  let position: TPosition = getRandomPosition(
    centerX,
    centerZ,
    radius,
    isSafeCenter,
  );
  while (isBadPosition(positions, position, distance)) {
    position = getRandomPosition(centerX, centerZ, radius, isSafeCenter);
  }
  return position;
};

export const getGridDiffByName = (name: Names): number => {
  return Math.floor(OBJECTS[name].size / (DESIGN.CELL * 2));
};

// THREE

// Текстура по имени
export const getTextureByName = (name: Names): Textures => {
  switch (name) {
    case Names.walls:
      return Textures.concrette;
    case Names.sand:
      return Textures.sand;
    case Names.sands:
      return Textures.sand2;
    case Names.plates:
      return Textures.plates;
  }
  return Textures.concrette;
};

// Повторения текстуры по имени
export const getRepeatByName = (name: Names | Textures): number => {
  switch (name) {
    case Textures.concrette:
      return 4;
    case Names.plates:
      return 2;
    case Textures.metall:
    case Textures.metall2:
      return 4;
    case Textures.glass:
      return 8;
    case Textures.sand2:
      return 0.5;
    case Names.sand:
      return 4096;
  }
  return 2;
};

// Геометрия по имени
export const getGeometryByName = (name: Names | string): BoxBufferGeometry => {
  switch (name) {
    // Постройка плит - исключение
    case 'build':
      return new THREE.BoxGeometry(DESIGN.CELL * 3, 2, DESIGN.CELL * 3);
    case Names.walls:
      return new THREE.BoxBufferGeometry(
        DESIGN.CELL,
        DESIGN.CELL * 2,
        DESIGN.CELL,
      );
    case Names.command:
    case Names.stations:
    case Names.plants:
    case Names.storages:
      return new THREE.BoxGeometry(
        DESIGN.CELL * 3,
        DESIGN.CELL * 2,
        DESIGN.CELL * 3,
      );
    case Names.factories:
      return new THREE.BoxGeometry(
        DESIGN.CELL * 5,
        DESIGN.CELL * 3,
        DESIGN.CELL * 5,
      );
    case Names.plates:
    default:
      return new THREE.BoxGeometry(DESIGN.CELL, 2, DESIGN.CELL);
  }
};

// Y координата по имени
export const getPositionYByName = (name: Names | string): number => {
  switch (name) {
    // Постройка плит - исключение
    case 'build':
      return OBJECTS.sand.positionY + 3.1;
    case Names.plates:
      return OBJECTS.sand.positionY + 3;
    case Names.walls:
      return OBJECTS.sand.positionY + OBJECTS.walls.size + 4;
    case Names.command:
    case Names.stations:
    case Names.plants:
    case Names.storages:
    case Names.factories:
    default:
      return OBJECTS.sand.positionY + 4;
  }
};

// Громкость по имени
export const getVolumeByName = (name: Audios): number => {
  return DESIGN.VOLUME[name];
};

// Узнать закольцован ли звук по имени
export const getIsLoopByName = (name: Audios): boolean => {
  switch (name) {
    case Audios.wind:
    case Audios.build:
      return true;
    case Audios.zero:
    case Audios.sell:
    case Audios.add:
    default:
      return false;
  }
};

// Layout

// Экранный помощник
export const ScreenHelper = (() => {
  const DESKTOP = DESIGN.BREAKPOINTS.desktop;

  const isDesktop = () => {
    return window.matchMedia(`(min-width: ${DESKTOP}px)`).matches;
  };

  const isBro = () => {
    const isChrome =
      /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isYandex = navigator.userAgent.search(/YaBrowser/) > 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isChrome || isYandex || isFirefox;
  };

  return {
    isDesktop,
    isBro,
  };
})();

// Помощник перезагрузки
export const restartDispatchHelper = (store: Store<State>): void => {
  store
    .dispatch('layout/setField', {
      field: 'isReload',
      value: true,
    })
    .then(() => {
      store
        .dispatch('game/reload')
        .then(() => {
          store
            .dispatch('objects/reload')
            .then(() => {
              store
                .dispatch('layout/reload')
                .then(() => {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  window.location.reload(true);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
