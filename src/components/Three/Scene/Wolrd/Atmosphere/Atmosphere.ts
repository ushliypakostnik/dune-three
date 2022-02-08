import * as THREE from 'three';
import {
  HemisphereLight,
  Texture,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  Mesh,
  GridHelper,
} from 'three';

// Constants
import { DESIGN, OBJECTS } from '@/utils/constants';

// Utils
import {
  loaderDispatchHelper,
  plusOrMinus,
  distance2D,
} from '@/utils/utilities';

// Types
import { ISelf, Module } from '@/models/modules';

export class Atmosphere extends Module {
  private _light: HemisphereLight;
  private _mapSand!: Texture;
  private _materialSand!: MeshLambertMaterial;
  private _geometrySand!: PlaneBufferGeometry;
  private _sand!: Mesh;
  private _grid!: GridHelper;

  constructor() {
    super(OBJECTS.ATMOSPHERE.name);

    this._light = new THREE.HemisphereLight(0x6699ff, 0x295826, 1);
  }

  init(self: ISelf): void {
    // Lights

    // Hemisphere
    this._light.position.set(0, DESIGN.SIZE * 2, 0).normalize();
    self.scene.add(this._light);

    // Ambient
    self.scene.add(new THREE.AmbientLight(DESIGN.COLORS.white));

    this._mapSand = new THREE.TextureLoader().load(
      './images/textures/sand.jpg',
      () => {
        self.render();
        loaderDispatchHelper(self.store, 'isSandLoaded');
      },
    );
    this._mapSand.repeat.set(4096, 4096);
    this._mapSand.wrapS = this._mapSand.wrapT = THREE.RepeatWrapping;
    this._mapSand.encoding = THREE.sRGBEncoding;

    this._materialSand = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS.yellowLight,
      map: this._mapSand,
    });

    this._geometrySand = new THREE.PlaneBufferGeometry(
      OBJECTS.SAND.radius * 10,
      OBJECTS.SAND.radius * 10,
      OBJECTS.SAND.radius / 10,
      OBJECTS.SAND.radius / 10,
    );
    const vertex = new THREE.Vector3();
    const { position } = this._geometrySand.attributes;
    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);
      vertex.x += (Math.random() * plusOrMinus() * DESIGN.CELL) / 10;
      vertex.y += (Math.random() * plusOrMinus() * DESIGN.CELL) / 10;
      vertex.z += (Math.random() * plusOrMinus() * DESIGN.CELL) / 10;

      if (
        distance2D(0, 0, vertex.x, vertex.y) > OBJECTS.SAND.radius * 1.1 &&
        distance2D(0, 0, vertex.x, vertex.y) < OBJECTS.SAND.radius * 3
      )
        vertex.z *= Math.random() * 33;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    this._sand = new THREE.Mesh(this._geometrySand, this._materialSand);
    this._sand.rotation.x = -Math.PI / 2;
    this._sand.position.set(0, OBJECTS.SAND.positionY, 0);
    this._sand.name = OBJECTS.SAND.name;

    this._sand.updateMatrix();

    self.scene.add(this._sand);

    this._grid = new THREE.GridHelper(
      DESIGN.SIZE,
      DESIGN.SIZE / DESIGN.CELL,
      new THREE.Color(DESIGN.COLORS.dark),
      new THREE.Color(DESIGN.COLORS.dark),
    );
    this._grid.position.y += 1;
    // self.scene.add(this._grid);

    loaderDispatchHelper(self.store, 'isAtmosphereBuild');
  }
}
