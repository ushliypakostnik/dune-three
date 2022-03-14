// Constants
import { Names, CAN_BUILD } from '@/utils/constants';

// Types
import type { ISelf, IModule } from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { AnimatedModule } from '@/models/modules';
import Atmosphere from '@/components/Scene/Wolrd/Atmosphere/Atmosphere';
import Builds from '@/components/Scene/Wolrd/Builds';

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

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3, name: Names): boolean {
    if (CAN_BUILD.includes(name))
      return this._builds.isCanAdd(self, vector, name);
    return false;
  }

  // Добавить новый объект
  public add(self: ISelf, vector: Vector3, name: Names): void {
    if (CAN_BUILD.includes(name)) this._builds.add(self, vector, name);
  }

  // Продать строение
  public sell(self: ISelf, items: string[], name: string): void {
    self.logger.log('World', 'sell!!!');
    this._builds.sell(self, items, name);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}

export default World;
