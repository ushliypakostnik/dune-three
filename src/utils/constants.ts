// Types
import { TConfig, TMessages } from '@/models/utils';

export const LANGUAGES: Array<TConfig> = [
  { id: 1, name: 'en' },
  { id: 2, name: 'ru' },
];

// Тут главный размер, относительно которого все по ширине,
// кроме того что должно быть адекватным росту по высоте
export const GROUND = 4000;
export const size = (size: number): number => {
  return size * GROUND;
};

export const DESIGN: TConfig = {
  V: '1.0.0',
  BREAKPOINTS: {
    desktop: 1025,
  },
  COLORS: {
    white: 0xffffff,
    black: 0x000000,
    blue: 0x88ccff,
    purple: 0xa48ed8,
    purpleDark: 0x8267bf,
    purpleDarken: 0x413460,
    panels: 0x13334c,
  },
  SIZE: size(1),
  CELL: 20,
  CAMERA: {
    fov: 80,
    fog: 0xa48ed8,
  },
};

export const OBJECTS: TConfig = {
  WORLD: {
    name: 'world',
  },
  ATMOSPHERE: {
    name: 'atmosphere',
    SAND: {
      radius: size(0.5),
      positionY: 0,
    },
  },
  STORE: {
    PLAYERUNITS: {
      name: 'playerUnits',
      size: 5,
      quantity: 10,
    },
  },
};

export const MESSAGES: TMessages = {
  en: {
    layout: {
      name: 'DuneThree',
      gadgetsgate: 'The game is for desktop browsers only!',
      chromegate: 'In order to play, open in the Google Chrome (or Yandex) browser (Firefox not recommended)',
      startbutton: 'Play',
      restartbutton: 'Start over',
      key1: 'Ecs - pause',
      copyright: '© Levon Gambaryan Bro Games',
    },
  },
  ru: {
    layout: {
      name: 'ДюнаThree',
      gadgetsgate: 'Игра только для десктопных браузеров!',
      chromegate: 'Для того чтобы играть откройте в браузере Google Chrome (или Яндекс), Firefox не рекомендуется',
      startbutton: 'Играть',
      restartbutton: 'Начать сначала',
      key1: 'Ecs - пауза',
      copyright: '© Levon Gambaryan Bro Games',
    },
  },
};

