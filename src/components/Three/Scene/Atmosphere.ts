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
import { ISelf, AnimatedModule } from '@/models/modules';

export class Atmosphere extends AnimatedModule {
  private light: HemisphereLight;
  private mapSand: Texture | undefined;
  private materialSand: MeshLambertMaterial | undefined;
  private geometrySand: PlaneBufferGeometry | undefined;
  private sand: Mesh | undefined;
  private grid: GridHelper | undefined;

  constructor() {
    super(OBJECTS.ATMOSPHERE.name);

    this.light = new THREE.HemisphereLight(0x6699ff, 0x295826, 1);
  }

  init(self: ISelf): void {
    // Lights

    // Hemisphere
    this.light.position.set(0, DESIGN.SIZE * 2, 0).normalize();
    self.scene.add(this.light);

    // Ambient
    self.scene.add(new THREE.AmbientLight(DESIGN.COLORS.white));

    this.mapSand = new THREE.TextureLoader().load(
      './images/textures/sand.jpg',
      () => {
        self.render();

        loaderDispatchHelper(self.store, 'isSand1Loaded');
      },
    );
    this.mapSand.repeat.set(4096, 4096);
    this.mapSand.wrapS = this.mapSand.wrapT = THREE.RepeatWrapping;
    this.mapSand.encoding = THREE.sRGBEncoding;

    this.materialSand = new THREE.MeshLambertMaterial({
      color: 0xf0bf7d,
      map: this.mapSand,
    });

    this.geometrySand = new THREE.PlaneBufferGeometry(
      OBJECTS.ATMOSPHERE.SAND.radius * 10,
      OBJECTS.ATMOSPHERE.SAND.radius * 10,
      OBJECTS.ATMOSPHERE.SAND.radius / 10,
      OBJECTS.ATMOSPHERE.SAND.radius / 10,
    );
    const vertex = new THREE.Vector3();
    const { position } = this.geometrySand.attributes;
    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);
      vertex.x += (Math.random() * plusOrMinus() * OBJECTS.STORE.PLAYERUNITS.size) / 3;
      vertex.y += (Math.random() * plusOrMinus() * OBJECTS.STORE.PLAYERUNITS.size) / 3;
      vertex.z += (Math.random() * plusOrMinus() * OBJECTS.STORE.PLAYERUNITS.size) / 3;

      if (
        distance2D(0, 0, vertex.x, vertex.y) >
          OBJECTS.ATMOSPHERE.SAND.radius * 1.1 &&
        distance2D(0, 0, vertex.x, vertex.y) <
          OBJECTS.ATMOSPHERE.SAND.radius * 3
      )
        vertex.z *= Math.random() * 25;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    this.sand = new THREE.Mesh(this.geometrySand, this.materialSand);
    this.sand.rotation.x = -Math.PI / 2;
    this.sand.position.set(0, OBJECTS.ATMOSPHERE.SAND.positionY, 0);

    this.sand.updateMatrix();

    self.scene.add(this.sand);

    this.grid = new THREE.GridHelper(
      DESIGN.SIZE,
      DESIGN.SIZE / DESIGN.CELL,
      new THREE.Color(DESIGN.COLORS.panels),
      new THREE.Color(DESIGN.COLORS.panels),
    );
    this.grid.position.y += 1;
    self.scene.add(this.grid);

    loaderDispatchHelper(self.store, 'isAtmosphereBuild');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animate(self: ISelf): void {}
}
