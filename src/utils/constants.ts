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
  stones = 'stones',
  sands = 'sands',
  spices = 'spices',

  builds = 'builds',
  plates = 'plates',
  walls = 'walls',
  command = 'command',
  stations = 'stations',
  plants = 'plants',
  storages = 'storages',
  factories = 'factories',

  units = 'units',
  // tanks = 'tanks',
}

// GUI

export enum Textures {
  concrette = 'concrette',
  metall = 'metall',
  metall2 = 'metall2',
  glass = 'glass',
  sand = 'sand',
  sand2 = 'sand2',
  spice = 'spice',
  plates = 'plates',
  hole = 'hole',
  player = 'player',
}

export enum Audios {
  wind = 'wind',
  zero = 'zero',
  build = 'build',
  add = 'add',
  sell = 'sell',

  // Objects
  command = 'command',
  stations = 'stations',
  plants = 'plants',
  storages = 'storages',
  factories = 'factories',

  // Units
  // tanks = 'tanks',
}

export enum Colors {
  white = 0xffffff,
  black = 0x000000,
  blue = 0x88ccff,
  yellow = 0xfed564,
  yellowLight = 0xffe064,

  dark = 0x13334c,

  // utils
  selection = 0xaa0000,
  pointer = 0xff2500,
  build = 0x5c5c30,

  // objects
  plates = 0xdfbf7d,
  stone = 0xee5500,
  walls = 0xf0bf7d,

  // textures
  concrette = 0xdfbf7d,
  metall = 0xf0bf7d,
  metall2 = 0xf0bf7d,
  glass = 0xf9bf7d,
  sand2 = 0xffd564,
  spice = 0xdd2200,
  player = 0xff66ff,
}

enum Breakpoints {
  desktop = 1025,
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
  SIZE: size(1),
  CELL: 20,
  CAMERA: {
    fov: 70,
    fog: 0xa48ed8,
  },
  // Дефолтные установки сцены
  START: {
    [Names.command]: [{ x: 0, z: 0 }],
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
    /*
    [Names.tanks]: [
      { x: -3, z: -3 },
      { x: 3, z: 0 },
      { x: -4, z: 2 },
    ], */
  },
  MESSAGES_TIMEOUT: 3000, // ms
  VOLUME: {
    [Audios.wind]: 0.1,
    [Audios.zero]: 0.3,
    [Audios.build]: 0.2,
    [Audios.sell]: 0.1,
    [Audios.add]: 0.1,
    [Audios.command]: 0.025,
    [Audios.stations]: 1,
    [Audios.plants]: 0.5,
    [Audios.storages]: 1,
    [Audios.factories]: 0.5,
    // [Audios.tanks]: 0.5,
  },
  ATMOSPHERE_ELEMENTS: {
    [Names.stones]: 8,
    [Names.sands]: 8,
    [Names.spices]: 8,
  },
};

// Все объекты

// Префикс псевдообъектов
export const PSEUDO = 'pseudo/';

// Части моделей
export const CHILD = 'child/';

export const OBJECTS: TConfig = {
  // [Names.world]: {},
  // [Names.atmosphere]: {},
  // [Names.builds]: {},
  [Names.sand]: {
    radius: size(0.5),
    positionY: 0,
  },
  [Names.command]: {
    size: DESIGN.CELL * 3,
    need: {
      cash: 0,
      energy: 10,
      food: 10,
    },
    gives: {
      cash: null,
      energy: null,
      food: null,
    },
  },
  [Names.plates]: {
    size: DESIGN.CELL,
    time: 1,
    need: {
      cash: 1,
      energy: 1,
      food: 0,
    },
    gives: {
      cash: null,
      energy: null,
      food: null,
    },
  },
  [Names.walls]: {
    size: DESIGN.CELL,
    time: 1,
    need: {
      cash: 5,
      energy: 2,
      food: 0,
    },
    gives: {
      cash: null,
      energy: null,
      food: null,
    },
  },
  [Names.stations]: {
    size: DESIGN.CELL * 3,
    time: 3,
    need: {
      cash: 15,
      energy: 0,
      food: 10,
    },
    gives: {
      cash: null,
      energy: 50,
      food: null,
    },
  },
  [Names.plants]: {
    size: DESIGN.CELL * 3,
    time: 3,
    need: {
      cash: 15,
      energy: 10,
      food: 0,
    },
    gives: {
      cash: null,
      energy: null,
      food: 50,
    },
  },
  [Names.storages]: {
    size: DESIGN.CELL * 3,
    time: 5,
    need: {
      cash: 25,
      energy: 10,
      food: 10,
    },
    gives: {
      cash: 200,
      energy: null,
      food: null,
    },
  },
  [Names.factories]: {
    size: DESIGN.CELL * 5,
    time: 10,
    need: {
      cash: 250,
      energy: 25,
      food: 25,
    },
    gives: {
      cash: null,
      energy: null,
      food: null,
    },
  },
  /*
  [Names.tanks]: {
    size: DESIGN.CELL,
    time: 10,
    need: {
      cash: 50,
      energy: 10,
      food: 5,
    },
    gives: {
      cash: null,
      energy: null,
      food: null,
    },
  }, */
};

// Объекты-модули которые можно строить
export const MODULE_BUILD: string[] = [
  Names.stations,
  Names.plants,
  Names.storages,
  Names.factories,
];

// Объекты которые можно строить
export const CAN_BUILD = [Names.plates, Names.walls, ...MODULE_BUILD];

// Все постройки кроме плиток
export const BUILDS = [Names.command, Names.walls, ...MODULE_BUILD];

// Все строения
export const BUILDS_ALL = BUILDS.concat(Names.plates);

// Юниты
export const UNITS = [
  /* Names.tanks */
];

// Объекты которые можно выделять
export const SELECTABLE_OBJECTS = [...CAN_BUILD, ...UNITS];

// Звуки которые не запускаются сразу
export const NOT_START_AUDIOS = [
  /* Audios.tanks */
];

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
    cash: 'Credits',
    energy: 'Energy',
    food: 'Food',
    health: 'Protection',
    sell: 'Sell',
    need: 'Requires',
    gives: 'Gives',
    builds: 'Builds',
    units: 'Units',

    [Names.command]: 'Command post',
    [Names.plates]: 'Plate',
    [Names.walls]: 'Wall',
    [Names.stations]: 'Power',
    [Names.plants]: 'Greenhouse',
    [Names.storages]: 'Warehouse',
    [Names.factories]: 'Factory',
    // [Names.tanks]: 'Tank',

    // Messages
    impossibleToBuild: 'Impossible to build!',
    buildDone: 'Construction completed!',
    buildingsSold: 'Buildings sold!',
    buildStations: 'Not enough energy! Build a power plant!',
    buildPlants: 'Not enough food! Build a greenhouse!',
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
    cash: 'Кредиты',
    energy: 'Энергия',
    food: 'Еда',
    health: 'Защита КП',
    sell: 'Продать',
    need: 'Требует',
    gives: 'Дает',
    builds: 'Здания',
    units: 'Техника',

    [Names.command]: 'Командный пункт',
    [Names.plates]: 'Плита',
    [Names.walls]: 'Стена',
    [Names.stations]: 'АЭС',
    [Names.plants]: 'Оранжерея',
    [Names.storages]: 'Склад',
    [Names.factories]: 'Завод',
    // [Names.tanks]: 'Танк',

    // Messages
    impossibleToBuild: 'Невозможно построить!',
    buildDone: 'Строительство завершено!',
    buildingsSold: 'Постройки проданы!',
    buildStations: 'Недостаточно энергии! Постройте электростанцию!',
    buildPlants: 'Недостаточно еды! Постройте оранжерею!',
  },
};
