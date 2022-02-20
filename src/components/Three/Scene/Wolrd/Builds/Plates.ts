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
import { getGeometryByName } from '@/utils/utilities';

export class Plates extends Modules {
  private _map!: Texture;
  private _material!: MeshLambertMaterial;
  private _geometry!: BoxBufferGeometry;

  constructor() {
    super(Names.plates);

    // Форма
    this._geometry = getGeometryByName(this.name);
  }

  // Инициализация одного объекта
  public initItem(
    self: ISelf,
    item: TPosition | TObject,
    isStart: boolean,
  ): void {
    self.helper.initItemHelper(
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
    this._map = self.helper.setMapHelper(self, this.name, 2);

    // Материал
    this._material = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS[this.name],
      map: this._map,
    });

    self.helper.initModulesHelper(self, this);
    self.helper.loaderDispatchHelper(self.store, `${this.name}IsBuild`);
  }

  // Добавить объект
  public add(self: ISelf, vector: Vector3): void {
    self.helper.addItemHelper(self, this, vector);
  }
}
