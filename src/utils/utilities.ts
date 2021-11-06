// Constants
import { DESIGN } from '@/utils/constants';

// Types
import { TPosition } from '@/models/utils';
import { Store } from 'vuex';
import { State } from '@/store';

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

// Helpers

export const loaderDispatchHelper = (store: Store<State>, field: string) => {
  store.dispatch('preloader/preloadOrBuilt', field).then(() => {
    store.dispatch('preloader/isAllLoadedAndBuilt');
  }).catch((error) => { console.log(error); });
};

export const restartDispatchHelper = (store: Store<State>) => {
  store.dispatch('objects/reload').then(() => {
    store.dispatch('layout/reload').then(() => {
      setTimeout(() => {
        window.location.reload(true);
      }, 100);
    }).catch((error) => { console.log(error); });;
  }).catch((error) => { console.log(error); });
};

export const ScreenHelper = (() => {
  const DESKTOP = DESIGN.BREAKPOINTS.desktop;

  const isDesktop = () => {
    return window.matchMedia(`(min-width: ${DESKTOP}px)`).matches;
  };

  const isBro = () => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isYandex = navigator.userAgent.search(/YaBrowser/) > 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    return isChrome || isYandex || isFirefox;
  };

  return {
    isDesktop,
    isBro,
  };
})();
