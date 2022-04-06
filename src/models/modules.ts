import * as THREE from 'three';

// Constants
import { Names, Colors } from '@/utils/constants';

// Types
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { TObject } from '@/models/store';
import type {
  BoxBufferGeometry,
  MeshStandardMaterial,
  Scene,
  Vector3,
  AudioListener,
} from 'three';
import type Helper from '@/utils/helper';
import type Assets from '@/utils/assets';
import type Events from '@/utils/events';
import type AudioBus from '@/utils/audio';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Utils
import { getGeometryByName } from '@/utils/utilities';

// Interfaces
///////////////////////////////////////////////////////

// Main object
export interface ISelf {
  // Utils
  helper: Helper;
  assets: Assets;
  events: Events;
  audio: AudioBus;

  // Core
  store: Store<State>;
  scene: Scene;
  listener: AudioListener;
  render: () => void;
}

// Статичный модуль без копий - например Атмосфера
export interface ISimpleModule {
  init(self: ISelf): void;
}

// Модули
interface IModule extends ISimpleModule {
  isCanAdd(self: ISelf, vector: Vector3, name?: Names): boolean;
  add(self: ISelf, vector: Vector3, name?: Names): void;
  remove(self: ISelf, items: string[], name?: Names): void;
}

// Aнимированные модули
interface IAnimatedModule extends IModule {
  animate(self: ISelf): void;
}

// Модули с копиями
interface IModules extends IModule {
  initItem(self: ISelf, item: TObject, isStart: boolean): void;
}

// Анимированные модули с копиями
interface IAnimatedModules extends IAnimatedModule {
  initItem(self: ISelf, item: TObject, isStart: boolean): void;
}

// Abstract
///////////////////////////////////////////////////////

// Статичный модуль без копий - например Атмосфера
export abstract class SimpleModule implements ISimpleModule {
  constructor(public name: Names) {
    this.name = name;
  }

  // Инициализация
  public abstract init(self: ISelf): void;
}

// Обертки и модули
abstract class Module extends SimpleModule implements IModule {
  constructor(public name: Names) {
    super(name);
  }

  // Можно ли добавить новый объект?
  public abstract isCanAdd(self: ISelf, vector: Vector3, name?: Names): boolean;

  // Добавить новую единицу
  public abstract add(self: ISelf, vector: Vector3, name?: Names): void;

  // Убрать объекты
  public abstract remove(self: ISelf, items: string[], name?: Names): void;
}

// Анимированный модуль
export abstract class AnimatedModule extends Module implements IAnimatedModule {
  constructor(public name: Names) {
    super(name);
  }

  // Анимация
  public abstract animate(self: ISelf): void;
}

//  Модули
abstract class Modules extends Module implements IModules {
  constructor(public name: Names) {
    super(name);
  }

  // Инициализировать новую единицу
  public abstract initItem(self: ISelf, item: TObject, isStart: boolean): void;
}

// Анимированные модули
abstract class AnimatedModules extends Modules implements IAnimatedModules {
  constructor(public name: Names) {
    super(name);
  }

  // Анимация
  public abstract animate(self: ISelf): void;
}

// Real
///////////////////////////////////////////////////////

// Обертки
export class Wrapper extends AnimatedModule implements IAnimatedModule {
  constructor(public name: Names) {
    super(name);
  }

  public init(self: ISelf): void {
    console.log('modules.ts', 'Wrapper', 'init ', this.name, self);
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3, name?: Names): boolean {
    console.log('modules.ts', 'Wrapper', 'isCanAdd ', vector, name);
    return false;
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3, name?: Names): void {
    console.log('modules.ts', 'Wrapper', 'add ', vector, name);
  }

  // Удалить объекты
  public remove(self: ISelf, items: string[], name?: Names): void {
    console.log('modules.ts', 'Wrapper', 'remove ', items, name);
  }

  public animate(self: ISelf): void {
    console.log('modules.ts', 'Wrapper', 'animate ', this.name, self);
  }
}

// Строения
export class Builds extends Modules implements IModules {
  constructor(public name: Names) {
    super(name);
  }

  public init(self: ISelf): void {
    console.log('modules.ts', 'Builds', 'init ', this.name, self);
  }

  public initItem(self: ISelf, item: TObject, isStart: boolean): void {
    console.log(
      'modules.ts',
      'Builds',
      'initItem ',
      this.name,
      self,
      item,
      isStart,
    );
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3): boolean {
    return self.helper.isCanAddItemHelper(self, vector, this.name);
  }

  // Удалить объекты
  public remove(self: ISelf, items: string[]): void {
    self.helper.sellHelper(self, items, this.name);
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3): void {
    self.helper.addItemHelper(self, this, vector);
  }
}

// Юниты
export class Units extends AnimatedModules implements IAnimatedModules {
  public model!: GLTF;

  constructor(public name: Names) {
    super(name);
  }

  // Инициализация одного объекта
  public initItem(self: ISelf, item: TObject, isStart: boolean): void {
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
    self.assets.GLTFLoader.load(
      `./images/models/${this.name}.glb`,
      (model: GLTF) => {
        // Прелоадер
        self.helper.loaderDispatchHelper(self.store, `${this.name}IsLoaded`);
        this.model = self.helper.traverseHelper(self, model, this.name);

        // Инициализация
        self.helper.initModulesHelper(self, this);
        self.render();
      },
    );
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3): boolean {
    return self.helper.isCanAddItemHelper(self, vector, this.name);
  }

  // Удалить объекты
  public remove(self: ISelf, items: string[]): void {
    self.helper.sellHelper(self, items, this.name);
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3): void {
    self.helper.addItemHelper(self, this, vector);
  }

  public animate(self: ISelf): void {
    console.log('modules.ts', 'Units', 'animate ', this.name, self);
  }
}

// Статичные строения без моделей
export class StaticSimpleBuilds extends Builds {
  public geometry!: BoxBufferGeometry;
  public material!: MeshStandardMaterial;

  constructor(public name: Names) {
    super(name);
  }

  // Инициализация одного объекта
  public initItem(self: ISelf, item: TObject, isStart: boolean): void {
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
    this.material = new THREE.MeshStandardMaterial({
      color: Colors[this.name as keyof typeof Colors],
      map: self.assets.getTexture(this.name), // Текстура
    });

    // Инициализация
    self.helper.initModulesHelper(self, this);
  }
}

// Статичные строения c моделью
export class StaticModelsBuilds extends Builds {
  public model!: GLTF;

  constructor(public name: Names) {
    super(name);
  }

  // Инициализация одного объекта
  public initItem(self: ISelf, item: TObject, isStart: boolean): void {
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
    self.assets.GLTFLoader.load(
      `./images/models/${this.name}.glb`,
      (model: GLTF) => {
        // Прелоадер
        self.helper.loaderDispatchHelper(self.store, `${this.name}IsLoaded`);
        this.model = self.helper.traverseHelper(self, model, this.name);

        // Инициализация
        self.helper.initModulesHelper(self, this);
        self.render();
      },
    );
  }
}
