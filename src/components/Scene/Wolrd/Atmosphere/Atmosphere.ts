import * as THREE from 'three';
// Constants
import { Names, Colors, DESIGN, OBJECTS } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { HemisphereLight, Mesh, GridHelper } from 'three';

// Modules
import { Module } from '@/models/modules';

// Utils
import {
  plusOrMinus,
  distance2D,
} from '@/utils/utilities';

export default class Atmosphere extends Module {
  private _light: HemisphereLight;
  private _sand!: Mesh;
  private _grid!: GridHelper;

  constructor() {
    super(Names.atmosphere);

    this._light = new THREE.HemisphereLight(0x6699ff, 0x295826, 1);
  }

  init(self: ISelf): void {
    // Lights

    // Hemisphere
    this._light.position.set(0, DESIGN.SIZE * 2, 0).normalize();
    self.scene.add(this._light);

    // Ambient
    self.scene.add(new THREE.AmbientLight(Colors.white));

    // Sand

    // Форма
    self.helper.geometry = new THREE.PlaneBufferGeometry(
      OBJECTS.sand.radius * 10,
      OBJECTS.sand.radius * 10,
      OBJECTS.sand.radius / 10,
      OBJECTS.sand.radius / 10,
    );

    // Текстура и материал
    self.helper.map = self.assets.getTexture(Names.sand);
    self.helper.material = new THREE.MeshStandardMaterial({
      color: Colors.yellowLight,
      map: self.helper.map,
    });

    // Искажение
    const vertex = new THREE.Vector3();
    const { position } = self.helper.geometry.attributes;
    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);
      vertex.x += (Math.random() * plusOrMinus() * DESIGN.CELL) / 10;
      vertex.y += (Math.random() * plusOrMinus() * DESIGN.CELL) / 10;
      vertex.z += (Math.random() * plusOrMinus() * DESIGN.CELL) / 10;

      if (
        distance2D(0, 0, vertex.x, vertex.y) > OBJECTS.sand.radius * 1.1 &&
        distance2D(0, 0, vertex.x, vertex.y) < OBJECTS.sand.radius * 3
      )
        vertex.z *= Math.random() * 33;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    this._sand = new THREE.Mesh(self.helper.geometry, self.helper.material);
    this._sand.rotation.x = -Math.PI / 2;
    this._sand.position.set(0, OBJECTS.sand.positionY, 0);
    this._sand.name = Names.sand;
    this._sand.updateMatrix();
    self.scene.add(this._sand);

    // Вспомогательная сетка
    this._grid = new THREE.GridHelper(
      DESIGN.SIZE,
      DESIGN.SIZE / DESIGN.CELL,
      new THREE.Color(Colors.dark),
      new THREE.Color(Colors.dark),
    );
    this._grid.position.y += 1;
    this._grid.position.x += DESIGN.CELL / 2;
    this._grid.position.z += DESIGN.CELL / 2;
    // self.scene.add(this._grid);

    self.helper.loaderDispatchHelper(self.store, 'atmosphereIsBuild');
  }
}
