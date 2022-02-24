// Prohects еnums ans constants
//////////////////////////////////////////////////////

// Types
import type { TConfig, TMessages } from '@/models/utils';

// Enums

// Modules
export enum Names {
  world = 'world',
  atmosphere = 'atmosphere',
  sand = 'sand',
  builds = 'builds',
  plates = 'plates',
  walls = 'walls',
  command = 'command',
  station = 'station',
}

// GUI

export enum Textures {
  concrette = 'concrette',
  sand = 'sand',
  plates = 'plates',
}

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
  pointer = 0xff2500,

  // objects
  plates = 0xdfbf7d,
  walls = 0xf0bf7d,
}

enum Languages {
  en = 'en',
  ru = 'ru',
}

// Configuration

export const LANGUAGES: string[] = [Languages.en, Languages.ru];

// Тут главный размер, относительно которого все по ширине,
// кроме того что должно быть адекватным росту по высоте
export const GROUND = 4000;
export const size = (size: number): number => {
  return size * GROUND;
};

// Конфиг
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
    [Names.plates]: [
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
    [Names.command]: [{ x: 0, z: 0 }],
  },
};

// Все объекты
export const OBJECTS: TConfig = {
  // [Names.world]: {},
  // [Names.atmosphere]: {},
  // [Names.builds]: {},
  [Names.sand]: {
    radius: size(0.5),
    positionY: 0,
  },
  [Names.plates]: {
    size: DESIGN.CELL,
    positionY: 1,
    isStartRotate: false,
    price: 1,
  },
  [Names.walls]: {
    size: DESIGN.CELL,
    positionY: 1,
    isStartRotate: false,
    price: 5,
  },
  [Names.command]: {
    size: DESIGN.CELL * 3,
    positionY: 1,
    isStartRotate: false,
    price: 0,
  },
  [Names.station]: {
    size: DESIGN.CELL,
    positionY: 1,
    isStartRotate: false,
    price: 15,
  },
};

// Объекты которые можно строить, в том порядке в котором они становятся доступными - слабо, но чтобы не усложнять!!!
export const CAN_BUILD: string[] = [Names.plates, Names.walls, Names.station];

// Объекты которые можно выделять
export const SELECTABLE_OBJECTS: string[] = [...CAN_BUILD];

// Переводы

export const MESSAGES: TMessages = {
  [Languages.en]: {
    name: 'DuneThree',
    gadgetsgate: 'The game is for desktop browsers only!',
    chromegate:
      'In order to play, open in the Google Chrome (or Yandex) browser (Firefox not recommended)',
    startbutton: 'Play',
    restartbutton: 'Start over',
    key1: 'Ecs - pause',
    key2: 'Space - group selection',
    key3: 'Tab - design mode',
    copyright: '© Levon Gambaryan Bro Games',

    [Names.plates]: 'Plate',
    [Names.walls]: 'Wall',
    [Names.command]: 'Command post',
    [Names.station]: 'Power station',
  },
  [Languages.ru]: {
    name: 'ДюнаThree',
    gadgetsgate: 'Игра только для десктопных браузеров!',
    chromegate:
      'Для того чтобы играть откройте в браузере Google Chrome (или Яндекс), Firefox не рекомендуется',
    startbutton: 'Играть',
    restartbutton: 'Начать сначала',
    key1: 'Ecs - пауза',
    key2: ' Space - групповое выделение',
    key3: 'Tab - режим конструктора',
    copyright: '© Levon Gambaryan Bro Games',

    [Names.plates]: 'Плита',
    [Names.walls]: 'Стена',
    [Names.command]: 'Командный пункт',
    [Names.station]: 'Электростанция',
  },
};
