// Constants
import { Names } from '@/utils/constants';

// Types
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { TPosition, TPositions } from '@/models/utils';
import type { Scene, MeshLambertMaterial, Mesh, Vector3 } from 'three';
import type { TObjectField } from '@/models/store';
import type Logger from '@/utils/logger';

export interface ISelf {
  logger: Logger;

  store: Store<State>;
  scene: Scene;
  render: () => void;

  // Utils
  distance: number;
  rotate: number;
  material: MeshLambertMaterial;
  mesh: Mesh;
  clone: Mesh;
  positions: TPositions;
  position: TPosition;
  objects: TObjectField;
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
export abstract class Modules extends Module {
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
  // Анимация
  public abstract animate(self: ISelf): void;

  // Добавить новую единицу
  public abstract add(self: ISelf, name: Names, vector: Vector3): void;
}
