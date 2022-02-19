// Constants
import { Names, CAN_BUILD } from '@/utils/constants';

// Types
import type { ISelf, IModule } from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { AnimatedModule } from '@/models/modules';
import { Atmosphere } from '@/components/Three/Scene/Wolrd/Atmosphere/Atmosphere';
import { Builds } from '@/components/Three/Scene/Wolrd/Builds';

class World extends AnimatedModule {
  // Modules
  private _athmosphere: IModule;

  // Animated modules
  private _builds: AnimatedModule;

  constructor() {
    super(Names.world);

    // Modules
    this._athmosphere = new Atmosphere();

    // Animated modules
    this._builds = new Builds();
  }

  public init(self: ISelf): void {
    // Modules
    this._athmosphere.init(self);

    // Animated modules
    this._builds.init(self);
  }

  public add(self: ISelf, name: Names, vector: Vector3): void {
    if (CAN_BUILD.includes(name)) this._builds.add(self, name, vector);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}

export default World;
