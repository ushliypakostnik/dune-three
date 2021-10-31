import { Tanks } from '@/components/Three/Scene/Tanks';
import { Scene } from 'three';

import { IAnimatedModule } from '@/models/modules';

class World implements IAnimatedModule {
  private tanks: any;

  constructor() {
    this.tanks = new Tanks();
  }

  public init(scene: Scene) {
    this.tanks = new Tanks();
    this.tanks.init(scene);
  }

  public animate() {
    this.tanks.animate();
  }
}

export default World;
