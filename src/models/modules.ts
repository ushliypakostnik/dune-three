import { Scene } from 'three';

export interface ISelf {
  scene: Scene;
  render: () => void;
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

// Utils
export type position2D = {
  x: number;
  y: number;
}
