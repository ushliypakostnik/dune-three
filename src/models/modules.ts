import * as THREE from 'three';

// Constants
import { Names, Colors } from '@/utils/constants';

// Types
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { TPosition } from '@/models/utils';
import type { TObject } from '@/models/store';
import type {
  BoxBufferGeometry,
  MeshLambertMaterial,
  Scene,
  Vector3,
} from 'three';
import type Logger from '@/utils/logger';
import type Helper from '@/utils/helper';
import type Assets from '@/utils/assets';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Utils
import { getGeometryByName } from '@/utils/utilities';

// Interfaces
///////////////////////////////////////////////////////

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

// Abstract
///////////////////////////////////////////////////////

// Статичный модуль без копий - например Атмосфера
export abstract class Module implements IModule {
  constructor(public name: Names) {
    this.name = name;
  }

  // Инициализация
  public abstract init(self: ISelf): void;
}

// Статичный модуль с копиями
abstract class ModuleItems extends Module {
  constructor(public name: Names) {
    super(name);
  }

  // Можно ли добавить новый объект?
  public abstract isCanAdd(self: ISelf, vector: Vector3, name?: Names): boolean;

  // Добавить новую единицу
  public abstract add(self: ISelf, vector: Vector3, name?: Names): void;

  // Продать строение
  public abstract sell(self: ISelf, items: string[], name?: string): void;
}

//  Модули
abstract class Modules extends ModuleItems {
  constructor(public name: Names) {
    super(name);
  }

  // Инициализировать новую единицу
  public abstract initItem(
    self: ISelf,
    item: TPosition,
    isStart: boolean,
  ): void;
}

// Анимированные модули
export abstract class AnimatedModule
  extends ModuleItems
  implements IAnimatedModule
{
  constructor(public name: Names) {
    super(name);
  }

  // Анимация
  public abstract animate(self: ISelf): void;
}

// Real
///////////////////////////////////////////////////////

export class StaticModules extends Modules {
  constructor(public name: Names) {
    super(name);
  }

  public init(self: ISelf): void {
    self.logger.log('modules.ts', 'init', this.name);
  }

  public initItem(
    self: ISelf,
    item: TPosition | TObject,
    isStart: boolean,
  ): void {
    self.logger.log('modules.ts', 'initItem', this.name, item, isStart);
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3): boolean {
    return self.helper.isCanAddItemHelper(self, vector, this.name);
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3): void {
    self.helper.addItemHelper(self, this, vector);
  }

  // Продать строение
  public sell(self: ISelf, items: string[]): void {
    self.helper.sellHelper(self, items, this.name);
  }
}

// Статичные модули
export class StaticSimpleModules extends StaticModules {
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
      color: Colors[this.name as keyof typeof Colors],
      map: self.assets.getTexture(this.name), // Текстура
    });

    // Инициализация
    self.helper.initModulesHelper(self, this);
  }
}

// Статичные модули c моделью
export class StaticModelModules extends StaticModules {
  public model!: GLTF;

  constructor(public name: Names) {
    super(name);
  }

  // Инициализация одного объекта
  public initItem(
    self: ISelf,
    item: TPosition | TObject,
    isStart: boolean,
  ): void {
    self.helper.initItemFromModelHelper(
      self,
      this.name,
      this.model,
      item,
      isStart,
    );
  }

  public init(self: ISelf): void {
    // Модель
    self.helper.GLTFLoader.load(
      `./images/models/${this.name}.glb`,
      (model: GLTF) => {
        // Прелоадер
        self.helper.loaderDispatchHelper(self.store, `${this.name}IsLoaded`);
        this.model = self.helper.traverseHelper(self, model);

        // Инициализация
        self.helper.initModulesHelper(self, this);
        self.render();
      },
    );
  }
}
