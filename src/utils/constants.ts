// Types
import { TConfig, TMessages } from '@/models/utils';

export const LANGUAGES: string[] = ['en', 'ru'];

// Тут главный размер, относительно которого все по ширине,
// кроме того что должно быть адекватным росту по высоте
export const GROUND = 4000;
export const size = (size: number): number => {
  return size * GROUND;
};

enum Breakpoints {
  desktop = 1025,
}

enum Colors {
  white = 0xffffff,
  black = 0x000000,
  blue = 0x88ccff,
  purple = 0xa48ed8,
  purpleDark = 0x8267bf,
  purpleDarken = 0x413460,
  yellow = 0xfed564,
  yellowLight = 0xffe064,
  dark = 0x13334c,
  selection = 0xaa0000,

  // objects
  plates = 0xf0bf7d,
}

export const DESIGN: TConfig = {
  V: '1.0.0',
  BREAKPOINTS: Breakpoints,
  COLORS: Colors,
  SIZE: size(1),
  CELL: 20,
  CAMERA: {
    fov: 80,
    fog: 0xa48ed8,
  },
  // Дефолтные установки сцены
  START: {
    plates: [
      { x: -1, z: -1 },
      { x: -1, z: 0 },
      { x: -1, z: 1 },
      { x: 0, z: -1 },
      { x: 0, z: 0 },
      { x: 0, z: 1 },
      { x: 1, z: 0 },
      { x: 1, z: 1 },
      { x: 1, z: -1 },
    ],
  },
};

export const OBJECTS: TConfig = {
  world: {
    name: 'world',
  },
  atmosphere: {
    name: 'atmosphere',
  },
  sand: {
    name: 'sand',
    radius: size(0.5),
    positionY: 0,
  },
  builds: {
    name: 'builds',
  },
  plates: {
    name: 'plates',
    size: DESIGN.CELL,
    positionY: 1,
    isStartRotate: false,
  },
};

export const SELECTABLE_OBJECTS: string[] = [OBJECTS.plates.name];

export const MESSAGES: TMessages = {
  en: {
    layout: {
      name: 'DuneThree',
      gadgetsgate: 'The game is for desktop browsers only!',
      chromegate:
        'In order to play, open in the Google Chrome (or Yandex) browser (Firefox not recommended)',
      startbutton: 'Play',
      restartbutton: 'Start over',
      key1: 'Ecs - pause',
      key2: 'Space - group selection',
      copyright: '© Levon Gambaryan Bro Games',
    },
  },
  ru: {
    layout: {
      name: 'ДюнаThree',
      gadgetsgate: 'Игра только для десктопных браузеров!',
      chromegate:
        'Для того чтобы играть откройте в браузере Google Chrome (или Яндекс), Firefox не рекомендуется',
      startbutton: 'Играть',
      restartbutton: 'Начать сначала',
      key1: 'Ecs - пауза',
      key2: 'Space - групповое выделение',
      copyright: '© Levon Gambaryan Bro Games',
    },
  },
};
