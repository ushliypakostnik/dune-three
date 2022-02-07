import * as THREE from 'three';

// Constants
import { DESIGN, OBJECTS } from '@/utils/constants';

// Types
import { ISelf, Module } from '@/models/modules';
import { TPosition } from '@/models/utils';
import { loaderDispatchHelper } from '@/utils/utilities';
import { Texture } from 'three';
import { MeshLambertMaterial } from 'three';
import { PlaneBufferGeometry } from 'three';

export class Plates extends Module {
  private map!: Texture;
  private material!: MeshLambertMaterial;
  private geometry!: PlaneBufferGeometry;

  constructor() {
    super(OBJECTS.STORE.PLATES.name);
  }

  public init(self: ISelf): void {
    this.map = new THREE.TextureLoader().load(
      './images/textures/concrete1.jpg',
      () => {
        self.render();
        loaderDispatchHelper(self.store, 'isConcrete1Loaded');
      },
    );
    this.map.repeat.set(2, 2);
    this.map.wrapS = this.map.wrapT = THREE.RepeatWrapping;
    this.map.encoding = THREE.sRGBEncoding;

    this.material = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS.concrete1,
      map: this.map,
    });

    this.geometry = new THREE.BoxGeometry(
      OBJECTS.STORE.PLATES.size,
      2,
      OBJECTS.STORE.PLATES.size,
    );

    self.mesh = new THREE.Mesh(this.geometry, this.material);
    self.mesh.position.y = OBJECTS.STORE.PLATES.positionY;

    self.objects = [...self.store.getters['objects/objects'][this.name]];

    if (self.objects && self.objects.length === 0) {
      DESIGN.START.forEach((plate: TPosition) => {
        self.clone = self.mesh.clone();
        self.clone.position.x = plate.x * DESIGN.CELL + DESIGN.CELL / 2;
        self.clone.position.z = plate.z * DESIGN.CELL + DESIGN.CELL / 2;
        self.scene.add(self.clone);
        self.objects.push({
          id: self.clone.id,
          name: this.name,
          x: plate.x,
          z: plate.z,
          r: 0,
          health: 100,
        });
      });
      self.store.dispatch('objects/saveObjects', {
        name: this.name,
        objects: self.objects,
      });
    } else {
      self.objects.forEach((plate) => {
        self.clone = self.mesh.clone();
        self.clone.position.x = plate.x * DESIGN.CELL + DESIGN.CELL / 2;
        self.clone.position.z = plate.z * DESIGN.CELL + DESIGN.CELL / 2;
        self.scene.add(self.clone);
      });
    }

    loaderDispatchHelper(self.store, 'isPlatesBuild');
  }
}
