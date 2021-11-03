import * as THREE from 'three';
import {
  Scene,
  HemisphereLight,
  Texture,
  MeshLambertMaterial,
  PlaneBufferGeometry,
  Mesh,
} from 'three';

// Constants
import { DESIGN, OBJECTS } from '@/utils/constants';

// Utils
import { plusOrMinus, distance2D } from '@/utils/utilities';

// Types
import { ISelf, AnimatedModule } from '@/models/modules';

export class Atmosphere extends AnimatedModule {
  private light: HemisphereLight;
  private mapSand: Texture | undefined;
  private materialSand: MeshLambertMaterial | undefined;
  private geometrySand: PlaneBufferGeometry | undefined;
  private sand: Mesh | undefined;

  constructor() {
    super();

    this.light = new THREE.HemisphereLight(0x6699ff, 0x295826, 1);
  }

  init(self: ISelf): void {
    // Lights

    // Hemisphere
    this.light.position.set(0, DESIGN.GROUND_SIZE * 2, 0).normalize();
    self.scene.add(this.light);

    // Ambient
    self.scene.add(new THREE.AmbientLight(DESIGN.COLORS.white));

    this.mapSand = new THREE.TextureLoader().load(
      './images/textures/sand.jpg',
      () => {
        self.render();

        // loaderDispatchHelper(scope.$store, 'isSandLoaded1');
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
      OBJECTS.SAND.radius * 10,
      OBJECTS.SAND.radius * 10,
      OBJECTS.SAND.radius / 10,
      OBJECTS.SAND.radius / 10,
    );
    const vertex = new THREE.Vector3();
    const { position } = this.geometrySand.attributes;
    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i);
      vertex.x += (Math.random() * plusOrMinus() * OBJECTS.TANKS.size) / 3;
      vertex.y += (Math.random() * plusOrMinus() * OBJECTS.TANKS.size) / 3;
      vertex.z += (Math.random() * plusOrMinus() * OBJECTS.TANKS.size) / 3;

      if (
        distance2D(0, 0, vertex.x, vertex.y) > OBJECTS.SAND.radius * 1.1 &&
        distance2D(0, 0, vertex.x, vertex.y) < OBJECTS.SAND.radius * 3
      )
        vertex.z *= Math.random() * 25;

      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    this.sand = new THREE.Mesh(this.geometrySand, this.materialSand);
    this.sand.rotation.x = -Math.PI / 2;
    this.sand.position.set(0, OBJECTS.SAND.positionY, 0);

    this.sand.updateMatrix();

    self.scene.add(this.sand);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animate(self: ISelf): void {}
}
