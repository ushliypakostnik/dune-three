import { Atmosphere } from '@/components/Three/Scene/Atmosphere';
import { PlayerUnits } from '@/components/Three/Scene/PlayerUnits';

// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, IAnimatedModule, AnimatedModule } from '@/models/modules';

class World extends AnimatedModule {
  private athmosphere: IAnimatedModule;

  private playerUnits: IAnimatedModule;

  constructor() {
    super(OBJECTS.WORLD.name);

    this.athmosphere = new Atmosphere();

    this.playerUnits = new PlayerUnits();
  }

  public init(self: ISelf): void {
    this.athmosphere.init(self);

    this.playerUnits.init(self);
  }

  public animate(self: ISelf): void {
    this.athmosphere.animate(self);

    this.playerUnits.animate(self);
  }
}

export default World;
