import * as THREE from 'three';

// Constants
import { Names, DESIGN } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { Texture, MeshLambertMaterial, BoxBufferGeometry } from 'three';
import type { TPosition } from '@/models/utils';
import type { TObject } from '@/models/store';
import type { Vector3 } from 'three';

// Modules
import { Modules } from '@/models/modules';

// Utils
import {
  setMapHelper,
  initModulesHelper,
  loaderDispatchHelper,
  getGeometryByName,
  addItemHelper,
  initItemHelper,
} from '@/utils/utilities';

export class Walls extends Modules {
  private _map!: Texture;
  private _material!: MeshLambertMaterial;
  private _geometry!: BoxBufferGeometry;

  constructor() {
    super(Names.walls);

    // Форма
    this._geometry = getGeometryByName(this.name);
  }

  // Инициализация одного объекта
  public initItem(
    self: ISelf,
    item: TPosition | TObject,
    isStart: boolean,
  ): void {
    initItemHelper(
      self,
      this.name,
      item,
      isStart,
      this._material,
      this._geometry,
    );
  }

  // Инициализация
  public init(self: ISelf): void {
    // Текстура
    this._map = setMapHelper(self, this.name, 2);

    // Материал
    this._material = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS[this.name],
      map: this._map,
    });

    initModulesHelper(self, this);
    loaderDispatchHelper(self.store, `${this.name}IsBuild`);
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3): void {
    self.logger.log('Walls', 'add', self.position);

    addItemHelper(self, this, vector);
  }
}
