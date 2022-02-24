// Constants
import { Names } from '@/utils/constants';

// Types
import type { ISelf, StaticModules } from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { AnimatedModule } from '@/models/modules';
import Command from '@/components/Scene/Wolrd/Builds/Command';
import Plates from '@/components/Scene/Wolrd/Builds/Plates';
import Walls from '@/components/Scene/Wolrd/Builds/Walls';

export default class Builds extends AnimatedModule {
  // private _command: StaticModules;
  private _plates: StaticModules;
  private _walls: StaticModules;

  constructor() {
    super(Names.builds);

    // this._command = new Command();
    this._plates = new Plates();
    this._walls = new Walls();
  }

  public init(self: ISelf): void {
    // this._command.init(self);
    this._plates.init(self);
    this._walls.init(self);
  }

  public add(self: ISelf, name: Names, vector: Vector3): void {
    switch (name) {
      case Names.plates:
        this._plates.add(self, vector);
        break;
      case Names.walls:
        this._walls.add(self, vector);
        break;
    }
    self.helper.isNewBuildingAvailableHelper(self, name);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}
