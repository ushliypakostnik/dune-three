// Constants
import { Names } from '@/utils/constants';

// Types
import type { ISelf, Modules } from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { AnimatedModule } from '@/models/modules';
import { Plates } from '@/components/Three/Scene/Wolrd/Builds/Plates';
import { Walls } from '@/components/Three/Scene/Wolrd/Builds/Walls';

export class Builds extends AnimatedModule {
  private _plates: Modules;
  private _walls: Modules;

  constructor() {
    super(Names.builds);

    this._plates = new Plates();
    this._walls = new Walls();
  }

  public init(self: ISelf): void {
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}
