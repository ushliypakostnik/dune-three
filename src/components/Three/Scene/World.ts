import { Atmosphere } from '@/components/Three/Scene/Atmosphere';
import { PlayerUnits } from '@/components/Three/Scene/PlayerUnits';

// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, IModule, IAnimatedModule, AnimatedModule } from '@/models/modules';

class World extends AnimatedModule {
  // Modules
  private athmosphere: IModule;

  // Animated modules
  private playerUnits: IAnimatedModule;

  constructor() {
    super(OBJECTS.WORLD.name);

    // Modules
    this.athmosphere = new Atmosphere();

    // Animated modules
    this.playerUnits = new PlayerUnits();
  }

  public init(self: ISelf): void {
    // Modules
    this.athmosphere.init(self);

    // Animated modules
    this.playerUnits.init(self);
  }

  public animate(self: ISelf): void {
    // Animated modules
    this.playerUnits.animate(self);
  }
}

export default World;
