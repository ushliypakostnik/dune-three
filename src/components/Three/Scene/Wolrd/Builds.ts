// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, Module } from '@/models/modules';

// Modules
import { Plates } from '@/components/Three/Scene/Wolrd/Builds/Plates';

export class Builds extends Module {
  private plates: Module;

  constructor() {
    super(OBJECTS.BUILDS.name);

    this.plates = new Plates();
  }

  public init(self: ISelf): void {
    this.plates.init(self);
  }
}
