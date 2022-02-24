import * as THREE from 'three';

// Constants
import { Names, DESIGN } from '@/utils/constants';

// Types
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { TPosition } from '@/models/utils';
import type { TObject } from '@/models/store';
import type { BoxBufferGeometry, MeshLambertMaterial, Scene, Vector3 } from 'three';
import type Logger from '@/utils/logger';
import type Helper from '@/utils/helper';
import type Assets from '@/utils/assets';

// Utils
import { getGeometryByName } from '@/utils/utilities';

export interface ISelf {
  // Utils
  logger: Logger;
  helper: Helper;
  assets: Assets;

  // Core
  store: Store<State>;
  scene: Scene;
  render: () => void;
}

export interface IModule {
  init(self: ISelf): void;
}

export interface IAnimatedModule extends IModule {
  animate(self: ISelf): void;
}

// Статичный модуль
export abstract class Module implements IModule {
  constructor(public name: Names) {
    this.name = name;
  }

  // Инициализация
  public abstract init(self: ISelf): void;
}

// Статичные модули
abstract class Modules extends Module {
  constructor(public name: Names) {
    super(name);
  }

  // Инициализировать новую единицу
  public abstract initItem(
    self: ISelf,
    item: TPosition,
    isStart: boolean,
  ): void;

  // Добавить новую единицу
  public abstract add(self: ISelf, vector: Vector3): void;
}

// Анимированные модули
export abstract class AnimatedModule extends Module implements IAnimatedModule {
  constructor(public name: Names) {
    super(name);
  }

  // Анимация
  public abstract animate(self: ISelf): void;

  // Добавить новую единицу
  public abstract add(self: ISelf, name: Names, vector: Vector3): void;
}

// Статичные модули
export class StaticModules extends Modules {
  public geometry!: BoxBufferGeometry;
  public material!: MeshLambertMaterial;

  constructor(public name: Names) {
    super(name);
  }

  // Инициализация одного объекта
  public initItem(
    self: ISelf,
    item: TPosition | TObject,
    isStart: boolean,
  ): void {
    self.helper.initItemHelper(
      self,
      this.name,
      this.geometry,
      this.material,
      item,
      isStart,
    );
  }

  public init(self: ISelf): void {
    // Форма
    this.geometry = getGeometryByName(this.name);

    // Материал
    this.material = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS[this.name],
      map: self.assets.getTexture(this.name), // Текстура
    });

    // Инициализация
    self.helper.initModulesHelper(self, this);
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3): void {
    self.helper.addItemHelper(self, this, vector);
  }
}
