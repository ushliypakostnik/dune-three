import { Store } from 'vuex';
import { State } from '@/store';
import { TPosition, TPositions } from '@/models/utils';
import { Scene, Mesh } from 'three';
import { TObjectField } from '@/models/store';

export interface ISelf {
  store: Store<State>;
  scene: Scene;
  render: () => void;

  // Utils
  distance: number;
  rotate: number;
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

export abstract class Module implements IModule {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract init(self: ISelf): void;
}

export abstract class AnimatedModule extends Module implements IAnimatedModule {
  abstract animate(self: ISelf): void;

  constructor(name: string) {
    super(name);

    this.name = name;
  }
}
