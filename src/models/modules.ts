import { Store } from 'vuex';
import { State } from '@/store';
import { TPosition, TPositions } from '@/models/utils';
import { Scene, MeshLambertMaterial, Mesh } from 'three';
import { TObjectField } from '@/models/store';

export interface ISelf {
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
  constructor(public name: string) {
    this.name = name;
  }

  public abstract init(self: ISelf): void;
}

// Статичные модули
export abstract class Modules extends Module {
  public abstract initItem(
    self: ISelf,
    item: TPosition,
    isStart: boolean,
  ): void;
}

// Анимированный модуль
export abstract class AnimatedModule extends Module implements IAnimatedModule {
  public abstract animate(self: ISelf): void;
}
