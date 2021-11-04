import { Scene, Mesh } from 'three';
import { TPosition } from '@/models/utils';

export interface ISelf {
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
  abstract init(self: ISelf): void;
}

export abstract class AnimatedModule extends Module implements IAnimatedModule {
  abstract animate(self: ISelf): void;

  constructor() {
    super();
  }
}
