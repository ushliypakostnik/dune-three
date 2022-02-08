// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import {
  ISelf,
  IModule,
  AnimatedModule /*, IAnimatedModule */,
} from '@/models/modules';

// Modules
import { Atmosphere } from '@/components/Three/Scene/Wolrd/Atmosphere/Atmosphere';
import { Builds } from '@/components/Three/Scene/Wolrd/Builds';
// import { PlayerUnits } from '@/components/Three/Scene/PlayerUnits';

class World extends AnimatedModule {
  // Modules
  private _athmosphere: IModule;
  private _builds: IModule;

  // Animated modules

  constructor() {
    super(OBJECTS.WORLD.name);

    // Modules
    this._athmosphere = new Atmosphere();
    this._builds = new Builds();
  }

  public init(self: ISelf): void {
    // Modules
    this._athmosphere.init(self);
    this._builds.init(self);

    // Animated modules
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}

export default World;
