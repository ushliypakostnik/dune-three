import { Scene } from 'three';

export interface IModule {
  init(scene: Scene): void;
}

export interface IAnimatedModule extends IModule {
  animate(scene: Scene): void;
}
