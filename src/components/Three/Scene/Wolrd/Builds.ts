// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, Module } from '@/models/modules';

// Modules
import { Plates } from '@/components/Three/Scene/Wolrd/Builds/Plates';

export class Builds extends Module {
  private _plates: Module;

  constructor() {
    super(OBJECTS.builds.name);

    this._plates = new Plates();
  }

  public init(self: ISelf): void {
    this._plates.init(self);
  }
}
