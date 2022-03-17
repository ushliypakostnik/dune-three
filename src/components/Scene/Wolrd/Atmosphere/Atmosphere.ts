import * as THREE from 'three';
// Constants
import { Names, Colors, DESIGN, OBJECTS } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { HemisphereLight, Mesh, Group, GridHelper } from 'three';

// Modules
import { Module } from '@/models/modules';

// Utils
import {
  plusOrMinus,
  distance2D,
  randomInteger,
  getUniqueRandomPosition,
} from '@/utils/utilities';
import { TPosition } from '@/models/utils';

export default class Atmosphere extends Module {
  private _light: HemisphereLight;
  private _sand!: Mesh;
  private _grid!: GridHelper;
  private _stone!: Mesh;
  private _position!: TPosition;
  private _randomX!: number;
  private _randomZ!: number;
  private _diff!: number;
  private _height!: number;
  private _positions!: Array<TPosition>;
  private _mountain: Group = new THREE.Group();

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

    // Stones

    for (let n = 0; n < 15; ++n) {
      this._positions = [];
      this._mountain = new THREE.Group();
      this._position = getUniqueRandomPosition(
        this._positions,
        0,
        0,
        100,
        DESIGN.SIZE / DESIGN.CELL / 3,
      );
      console.log(this._position);
      this._randomX = randomInteger(5, 7);
      this._randomZ = randomInteger(5, 7);
      this._height = 1;
      let x = 0;
      let z = 0;
      while (x < this._randomX) {
        x += 1;

        z = 0;
        this._diff = randomInteger(-1, 1);
        while (z < this._randomZ) {
          z += 1;

          this._height += randomInteger(-2, 2);
          if (this._height < 1) this._height = 1;

          // Форма
          self.helper.geometry = new THREE.BoxBufferGeometry(
            DESIGN.CELL,
            DESIGN.CELL * this._height,
            DESIGN.CELL,
          );

          // Mатериал
          self.helper.material = new THREE.MeshStandardMaterial({
            color: Colors.stone,
          });

          this._stone = new THREE.Mesh(
            self.helper.geometry,
            self.helper.material,
          );
          this._stone.position.set(
            this._position.x + x * DESIGN.CELL,
            OBJECTS.sand.positionY,
            this._position.z + (z + this._diff) * DESIGN.CELL,
          );
          this._mountain.add(this._stone);
        }
      }
      self.scene.add(this._mountain);
    }

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
