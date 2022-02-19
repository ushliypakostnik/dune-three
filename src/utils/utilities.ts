import * as THREE from 'three';

// Constants
import { Names, DESIGN, OBJECTS } from '@/utils/constants';

// Types
import type { TPosition } from '@/models/utils';
import type { Store } from 'vuex';
import type { State } from '@/store';
import type {
  Texture,
  Vector3,
  BoxBufferGeometry,
  MeshLambertMaterial,
} from 'three';
import type { ISelf, Modules } from '@/models/modules';
import type { TObject } from '@/models/store';

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

// Helpers

// Получить координаты в сетке по вектору
export const objectCoordsHelper = (vector: Vector3): TPosition => {
  return {
    x: (vector.x - DESIGN.CELL / 2) / DESIGN.CELL,
    z: (vector.z - DESIGN.CELL / 2) / DESIGN.CELL,
  };
};

// Помощник прелодера
export const loaderDispatchHelper = (
  store: Store<State>,
  field: string,
): void => {
  store
    .dispatch('preloader/preloadOrBuilt', field)
    .then(() => {
      store.dispatch('preloader/isAllLoadedAndBuilt');
    })
    .catch((error) => {
      console.log(error);
    });
};

// Помощник загрузки и установки текстур
export const setMapHelper = (
  self: ISelf,
  name: string,
  repeat: number,
): Texture => {
  const map = new THREE.TextureLoader().load(
    `./images/textures/${name}.jpg`,
    () => {
      self.render();
      loaderDispatchHelper(self.store, `${name}IsLoaded`);
    },
  );
  map.repeat.set(repeat, repeat);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.encoding = THREE.sRGBEncoding;

  return map;
};

// Помощник инициализации одного объекта
export const initItemHelper = (
  self: ISelf,
  name: Names,
  item: TPosition,
  isStart: boolean,
  material: MeshLambertMaterial,
  geometry: BoxBufferGeometry,
): void => {
  self.material = material.clone();
  self.mesh = new THREE.Mesh(geometry, self.material);
  self.clone = self.mesh.clone();
  self.clone.position.x = item.x * DESIGN.CELL;
  self.clone.position.z = item.z * DESIGN.CELL;
  if (name !== Names.plates)
    self.clone.position.y = OBJECTS.plates.positionY + OBJECTS.plates.size + 1;
  else self.clone.position.y = OBJECTS.plates.positionY;
  self.clone.name = name;
  self.scene.add(self.clone);

  // Если стартовая инициализация или добавление нового объекта - сохраняем объект
  if (isStart) saveItemHelper(self, name, item);
};

// Помощник инициализации множественного модуля
export const initModulesHelper = (self: ISelf, that: Modules): void => {
  self.objects = [...self.store.getters['objects/objects'][that.name]];

  if (self.store.getters['objects/isStart'] && that.name === Names.plates) {
    DESIGN.START[that.name].forEach((item: TPosition) => {
      that.initItem(self, item, true);
    });
    self.store.dispatch('objects/saveObjects', {
      name: that.name,
      objects: self.objects,
    });
    self.store.dispatch('objects/setStart');
  } else {
    self.objects.forEach((item: TObject) => {
      that.initItem(self, item, false);
    });
  }
};

// Геометрия по имени
export const getGeometryByName = (name: Names): BoxBufferGeometry => {
  switch (name) {
    case Names.walls:
    default:
      return new THREE.BoxBufferGeometry(
        OBJECTS.plates.size,
        OBJECTS.plates.size * 2,
        OBJECTS.plates.size,
      );
    case Names.plates:
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

// Проверки

export const isPlateOnCoords = (self: ISelf): boolean => {
  self.objects = [...self.store.getters['objects/objects'][Names.plates]];
  return !!self.objects.find(
    (object) => object.x === self.position.x && object.z === self.position.z,
  );
};

// Помощник добавления объекта
export const addItemHelper = (
  self: ISelf,
  that: Modules,
  vector: Vector3,
): void => {
  self.position = objectCoordsHelper(vector);
  if (
    (that.name === Names.plates && !isPlateOnCoords(self)) ||
    isPlateOnCoords(self)
  ) {
    self.objects = [...self.store.getters['objects/objects'][that.name]];
    that.initItem(self, self.position, true);
    self.store.dispatch('objects/saveObjects', {
      name: that.name,
      objects: self.objects,
    });
  } else {
    if (that.name === Names.plates)
      self.logger.log('Plates', 'Тут плита уже есть!!!');
    else self.logger.log('Walls', 'Тут плиты нет!!!');
  }
};

// Помощник сохранения объекта
export const saveItemHelper = (
  self: ISelf,
  name: string,
  item: TPosition,
): void => {
  self.objects.push({
    id: self.clone.id,
    name: name,
    x: item.x,
    z: item.z,
    r: 0,
    health: 100,
  });
};

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
