import { Store } from 'vuex';
import { State } from '@/store';
import { TPosition } from '@/models/utils';
import { Scene, Mesh } from 'three';

export interface ISelf {
  store: Store<State>;
  scene: Scene;
  render: () => void;

  // Utils
  distance: number;
  mesh: Mesh;
  clone: Mesh;
  positions: Array<TPosition>;
  position: TPosition;
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
