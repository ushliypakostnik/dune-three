import { Tanks } from '@/components/Three/Scene/Tanks';
import { Atmosphere } from '@/components/Three/Scene/Atmosphere';

// Types
import { ISelf, IAnimatedModule, AnimatedModule } from '@/models/modules';

class World extends AnimatedModule {
  private tanks: IAnimatedModule;
  private athmosphere: IAnimatedModule;

  constructor() {
    super();

    this.athmosphere = new Atmosphere();
    this.tanks = new Tanks();
  }

  public init(self: ISelf): void {
    // Checking
    this.athmosphere.init(self);
    this.tanks.init(self);
  }

  public animate(self: ISelf): void {
    this.athmosphere.animate(self);
    this.tanks.animate(self);
  }
}

export default World;
