// Types
import { TPosition } from '@/models/utils';

export const yesOrNo = (): boolean => Math.random() >= 0.5;

export const plusOrMinus = (): number => {
  return Math.random() >= 0.5 ? 1 : -1;
};

export const distance2D = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const getRandomPosition = (): TPosition => {
  return [Math.random() * 100, Math.random() * 100];
};

const isBadPosition = (
  positions: Array<TPosition>,
  position: TPosition,
  distance: number,
): boolean => {
  return !!positions.find(
    (place: TPosition) =>
      distance2D(place[0], place[1], position[0], position[1]) < distance,
  );
};

export const getUniqueRandomPosition = (
  positions: Array<TPosition>,
  distance: number,
): TPosition => {
  let position: TPosition = getRandomPosition();
  while (isBadPosition(positions, position, distance)) {
    position = getRandomPosition();
  }
  return position;
};
