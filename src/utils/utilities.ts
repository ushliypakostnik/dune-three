// Useful functions
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Names, Textures, DESIGN, OBJECTS } from '@/utils/constants';

// Types
import type { TPosition } from '@/models/utils';
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { Vector3, BoxBufferGeometry } from 'three';

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

export const getRandomPosition = (
  centerX: number,
  centerZ: number,
  radius: number,
): TPosition => {
  return {
    x: centerX + Math.random() * plusOrMinus() * radius,
    z: centerZ + Math.random() * plusOrMinus() * radius,
  };
};

const isBadPosition = (
  positions: Array<TPosition>,
  position: TPosition,
  distance: number,
): boolean => {
  return !!positions.find(
    (place: TPosition) =>
      distance2D(place.x, place.z, position.x, position.z) < distance,
  );
};

export const getUniqueRandomPosition = (
  positions: Array<TPosition>,
  centerX: number,
  centerZ: number,
  distance: number,
  radius: number,
): TPosition => {
  let position: TPosition = getRandomPosition(centerX, centerZ, radius);
  while (isBadPosition(positions, position, distance)) {
    position = getRandomPosition(centerX, centerZ, radius);
  }
  return position;
};

export const getIntegerRandomPosition = (
  centerX: number,
  centerZ: number,
  radius: number,
): TPosition => {
  return {
    x: Math.round(centerX + Math.random() * plusOrMinus() * radius),
    z: Math.round(centerZ + Math.random() * plusOrMinus() * radius),
  };
};

// Design (for logger)
export const paddy = (number: number, padlen = 4, padchar = '0'): string => {
  const pad = new Array(1 + padlen).join(padchar);
  return (pad + number).slice(-pad.length);
};

// Получить координаты в сетке по вектору
export const objectCoordsHelper = (vector: Vector3): TPosition => {
  return {
    x: (vector.x - DESIGN.CELL / 2) / DESIGN.CELL,
    z: (vector.z - DESIGN.CELL / 2) / DESIGN.CELL,
  };
};

// Текстура по имени
export const getTextureByName = (name: Names): Textures => {
  switch (name) {
    case Names.walls:
      return Textures.concrette;
    case Names.sand:
      return Textures.sand;
    case Names.plates:
      return Textures.plates;
  }
  return Textures.concrette;
};

// Повторения текстуры по имени
export const getRepeatByName = (name: Names | Textures): number => {
  switch (name) {
    case Textures.concrette:
    case Names.plates:
      return 2;
    case Names.sand:
      return 4096;
  }
  return 2;
};

// Геометрия по имени
export const getGeometryByName = (name: Names): BoxBufferGeometry => {
  switch (name) {
    case Names.walls:
      return new THREE.BoxBufferGeometry(
        OBJECTS.plates.size,
        OBJECTS.plates.size * 2,
        OBJECTS.plates.size,
      );
    case Names.plates:
    default:
      return new THREE.BoxGeometry(OBJECTS.plates.size, 2, OBJECTS.plates.size);
  }
};

// Y координата по имени
export const getPositionYByName = (name: Names): number => {
  switch (name) {
    case Names.walls:
    default:
      return OBJECTS.plates.positionY + OBJECTS.plates.size + 1;
    case Names.plates:
      return OBJECTS.plates.positionY;
  }
};

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
    .dispatch('objects/reload')
    .then(() => {
      store
        .dispatch('layout/reload')
        .then(() => {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.location.reload(true);
          }, 100);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
