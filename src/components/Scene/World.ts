// Constants
import { Names, CAN_BUILD } from '@/utils/constants';

// Types
import type { ISelf, ISimpleModule } from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { Wrapper } from '@/models/modules';
import Atmosphere from '@/components/Scene/Wolrd/Atmosphere/Atmosphere';
import Builds from '@/components/Scene/Wolrd/Builds';
import Units from '@/components/Scene/Wolrd/Units';

class World extends Wrapper {
  // Modules
  private _athmosphere: ISimpleModule;

  // Animated modules
  private _builds: Wrapper;
  private _units: Wrapper;

  constructor() {
    super(Names.world);

    // Modules
    this._athmosphere = new Atmosphere();

    // Animated modules
    this._builds = new Builds();
    this._units = new Units();
  }

  public init(self: ISelf): void {
    // Modules
    this._athmosphere.init(self);

    // Animated modules
    this._builds.init(self);
    this._units.init(self);
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

  // Удалить объекты
  public remove(self: ISelf, items: string[], name: Names): void {
    this._builds.remove(self, items, name);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}

export default World;
