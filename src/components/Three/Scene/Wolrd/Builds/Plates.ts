import * as THREE from 'three';

// Types
import { ISelf, Modules } from '@/models/modules';
import { Texture, MeshLambertMaterial, BoxBufferGeometry } from 'three';
import { TPosition } from '@/models/utils';
import { TObject } from '@/models/store';
import {
  setMapHelper,
  initModulesHelper,
  saveItemHelper,
  loaderDispatchHelper,
} from '@/utils/utilities';

// Constants
import { DESIGN, OBJECTS } from '@/utils/constants';

export class Plates extends Modules {
  private _map!: Texture;
  private _material!: MeshLambertMaterial;
  private _geometry!: BoxBufferGeometry;

  constructor() {
    super(OBJECTS.plates.name);
  }

  public initItem(
    self: ISelf,
    item: TPosition | TObject,
    isStart: boolean,
  ): void {
    self.material = this._material.clone();
    self.mesh = new THREE.Mesh(this._geometry, self.material);
    self.clone = self.mesh.clone();
    self.clone.position.x = item.x * DESIGN.CELL + DESIGN.CELL / 2;
    self.clone.position.z = item.z * DESIGN.CELL + DESIGN.CELL / 2;
    self.clone.position.y = OBJECTS.plates.positionY;
    self.clone.name = this.name;
    self.scene.add(self.clone);

    // Если стартовая инициализация - сохраняем объект
    if (isStart) saveItemHelper(self, this.name, item);
  }

  public init(self: ISelf): void {
    // Текстура
    this._map = setMapHelper(self, this.name, 2);

    // Материал
    this._material = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS.plates,
      map: this._map,
    });

    // Форма
    this._geometry = new THREE.BoxGeometry(
      OBJECTS.plates.size,
      2,
      OBJECTS.plates.size,
    );

    // Инициализация
    initModulesHelper(self, this);
    loaderDispatchHelper(self.store, `${this.name}IsBuild`);
  }
}
