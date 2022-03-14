// Constants
import { Names } from '@/utils/constants';

// Types
import type {
  ISelf,
  StaticSimpleModules,
  StaticModelModules,
} from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { AnimatedModule } from '@/models/modules';
import Command from '@/components/Scene/Wolrd/Builds/Command';
import Plates from '@/components/Scene/Wolrd/Builds/Plates';
import Walls from '@/components/Scene/Wolrd/Builds/Walls';

export default class Builds extends AnimatedModule {
  private _command: StaticModelModules;
  private _plates: StaticSimpleModules;
  private _walls: StaticSimpleModules;

  constructor() {
    super(Names.builds);

    this._command = new Command();
    this._plates = new Plates();
    this._walls = new Walls();
  }

  public init(self: ISelf): void {
    this._command.init(self);
    this._plates.init(self);
    this._walls.init(self);
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3, name: Names): boolean {
    switch (name) {
      case Names.plates:
        return this._plates.isCanAdd(self, vector);
      case Names.walls:
        return this._walls.isCanAdd(self, vector);
    }
    return false;
  }

  // Добавить новый объект
  public add(self: ISelf, vector: Vector3, name: Names): void {
    switch (name) {
      case Names.plates:
        this._plates.add(self, vector);
        break;
      case Names.walls:
        this._walls.add(self, vector);
        break;
    }
  }

  // Продать строение
  public sell(self: ISelf, items: string[], name: string): void {
    self.logger.log('Builds', 'sell!!!');
    switch (name) {
      case Names.plates:
        this._plates.sell(self, items);
        break;
      case Names.walls:
        this._walls.sell(self, items);
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}
