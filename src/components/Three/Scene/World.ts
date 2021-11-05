import { Tanks } from '@/components/Three/Scene/Tanks';
import { Atmosphere } from '@/components/Three/Scene/Atmosphere';

// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, IAnimatedModule, AnimatedModule } from '@/models/modules';

class World extends AnimatedModule {
  private tanks: IAnimatedModule;
  private athmosphere: IAnimatedModule;

  constructor() {
    super(OBJECTS.WORLD.name);

    this.athmosphere = new Atmosphere();
    this.tanks = new Tanks();
  }

  public init(self: ISelf): void {
    this.athmosphere.init(self);
    this.tanks.init(self);
  }

  public animate(self: ISelf): void {
    this.athmosphere.animate(self);
    this.tanks.animate(self);
  }
}

export default World;
