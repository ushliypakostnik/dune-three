// Constants
import { Names } from '@/utils/constants';

// Types
import type { ISelf /*, Units as TUnits */ } from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { Wrapper } from '@/models/modules';
// import Tanks from '@/components/Scene/Wolrd/Units/Tanks';

export default class Units extends Wrapper {
  // private _tanks: TUnits;

  constructor() {
    super(Names.units);

    // this._tanks = new Tanks();
  }

  public init(/* self: ISelf */): void {
    // this._tanks.init(self);
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3, name?: Names): boolean {
    console.log('Units', 'isCanAdd', self, vector, name);
    return false;
  }

  // Добавить новый объект
  public add(self: ISelf, vector: Vector3, name: Names): void {
    console.log('Units', 'add', self, vector, name);
  }

  // Добавить новый объект
  public remove(self: ISelf, items: string[], name: Names): void {
    console.log('Units', 'remove', self, items, name);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
    console.log('Units', 'animate', self);
  }
}
