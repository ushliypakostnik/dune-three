// Constants
import { Names } from '@/utils/constants';

// Types
import type {
  ISelf,
  StaticSimpleBuilds,
  StaticModelsBuilds,
} from '@/models/modules';
import type { Vector3 } from 'three';

// Modules
import { Wrapper } from '@/models/modules';
import Command from '@/components/Scene/Wolrd/Builds/Command';
import Plates from '@/components/Scene/Wolrd/Builds/Plates';
import Walls from '@/components/Scene/Wolrd/Builds/Walls';
import Stations from '@/components/Scene/Wolrd/Builds/Stations';
import Plants from '@/components/Scene/Wolrd/Builds/Plants';
import Storages from '@/components/Scene/Wolrd/Builds/Storages';
import Factories from '@/components/Scene/Wolrd/Builds/Factories';

export default class Builds extends Wrapper {
  private _command: StaticModelsBuilds;
  private _plates: StaticSimpleBuilds;
  private _walls: StaticSimpleBuilds;
  private _stations: StaticModelsBuilds;
  private _plants: StaticModelsBuilds;
  private _storages: StaticModelsBuilds;
  private _factories: StaticModelsBuilds;

  constructor() {
    super(Names.builds);

    this._command = new Command();
    this._plates = new Plates();
    this._walls = new Walls();
    this._stations = new Stations();
    this._plants = new Plants();
    this._storages = new Storages();
    this._factories = new Factories();
  }

  public init(self: ISelf): void {
    this._command.init(self);
    this._plates.init(self);
    this._walls.init(self);
    this._stations.init(self);
    this._plants.init(self);
    this._storages.init(self);
    this._factories.init(self);
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
      case Names.storages:
        return this._storages.isCanAdd(self, vector);
      case Names.factories:
        return this._factories.isCanAdd(self, vector);
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
      case Names.storages:
        this._storages.add(self, vector);
        break;
      case Names.factories:
        this._factories.add(self, vector);
        break;
    }
  }

  // Продать строение
  public remove(self: ISelf, items: string[], name: Names): void {
    switch (name) {
      case Names.plates:
        this._plates.remove(self, items);
        break;
      case Names.walls:
        this._walls.remove(self, items);
        break;
      case Names.stations:
        this._stations.remove(self, items);
        break;
      case Names.plants:
        this._plants.remove(self, items);
        break;
      case Names.storages:
        this._storages.remove(self, items);
        break;
      case Names.factories:
        this._factories.remove(self, items);
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public animate(self: ISelf): void {
    // Animated modules
  }
}
