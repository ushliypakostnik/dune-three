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
import Stations from '@/components/Scene/Wolrd/Builds/Stations';
import Plants from '@/components/Scene/Wolrd/Builds/Plants';

export default class Builds extends AnimatedModule {
  private _command: StaticModelModules;
  private _plates: StaticSimpleModules;
  private _walls: StaticSimpleModules;
  private _stations: StaticModelModules;
  private _plants: StaticModelModules;

  constructor() {
    super(Names.builds);

    this._command = new Command();
    this._plates = new Plates();
    this._walls = new Walls();
    this._stations = new Stations();
    this._plants = new Plants();
  }

  public init(self: ISelf): void {
    this._command.init(self);
    this._plates.init(self);
    this._walls.init(self);
    this._stations.init(self);
    this._plants.init(self);
  }

  // Можно ли добавить новый объект?
  public isCanAdd(self: ISelf, vector: Vector3, name: Names): boolean {
    switch (name) {
      case Names.plates:
        return this._plates.isCanAdd(self, vector);
      case Names.walls:
        return this._walls.isCanAdd(self, vector);
      case Names.stations:
        return this._stations.isCanAdd(self, vector);
      case Names.plants:
        return this._plants.isCanAdd(self, vector);
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
      case Names.stations:
        this._stations.add(self, vector);
        break;
      case Names.plants:
        this._plants.add(self, vector);
        break;
    }
  }

  // Продать строение
  public sell(self: ISelf, items: string[], name: string): void {
    switch (name) {
      case Names.plates:
        this._plates.sell(self, items);
        break;
      case Names.walls:
        this._walls.sell(self, items);
        break;
      case Names.stations:
        this._stations.sell(self, items);
        break;
      case Names.plants:
        this._plants.sell(self, items);
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}
