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
  centerY: number,
  radius: number,
): TPosition => {
  return {
    x: centerX + Math.random() * plusOrMinus() * radius,
    z: centerY + Math.random() * plusOrMinus() * radius,
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
  centerY: number,
  distance: number,
  radius: number,
): TPosition => {
  let position: TPosition = getRandomPosition(centerX, centerY, radius);
  while (isBadPosition(positions, position, distance)) {
    position = getRandomPosition(centerX, centerY, radius);
  }
  return position;
};

// Helpers

export const loaderDispatchHelper = (store: Store<State>, field: string) => {
  store.dispatch('preloader/preloadOrBuilt', field).then(() => {
    store.dispatch('preloader/isAllLoadedAndBuilt');
  }).catch((error) => { console.log(error); });
};
