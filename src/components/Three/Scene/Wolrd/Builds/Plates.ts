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
  private _map!: Texture;
  private _material!: MeshLambertMaterial;
  private _geometry!: PlaneBufferGeometry;

  constructor() {
    super(OBJECTS.PLATES.name);
  }

  public init(self: ISelf): void {
    this._map = new THREE.TextureLoader().load(
      './images/textures/concrete1.jpg',
      () => {
        self.render();
        loaderDispatchHelper(self.store, 'isConcrete1Loaded');
      },
    );
    this._map.repeat.set(2, 2);
    this._map.wrapS = this._map.wrapT = THREE.RepeatWrapping;
    this._map.encoding = THREE.sRGBEncoding;

    this._material = new THREE.MeshLambertMaterial({
      color: DESIGN.COLORS.concrete1,
      map: this._map,
    });

    this._geometry = new THREE.BoxGeometry(
      OBJECTS.PLATES.size,
      2,
      OBJECTS.PLATES.size,
    );

    self.objects = [...self.store.getters['objects/objects'][this.name]];

    if (self.objects && self.objects.length === 0) {
      DESIGN.START.forEach((plate: TPosition) => {
        self.material = this._material.clone();
        self.mesh = new THREE.Mesh(this._geometry, self.material);
        self.clone = self.mesh.clone();
        self.clone.position.x = plate.x * DESIGN.CELL + DESIGN.CELL / 2;
        self.clone.position.z = plate.z * DESIGN.CELL + DESIGN.CELL / 2;
        self.clone.position.y = OBJECTS.PLATES.positionY;
        self.clone.name = this.name;
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
        self.material = this._material.clone();
        self.mesh = new THREE.Mesh(this._geometry, self.material);
        self.clone = self.mesh.clone();
        self.clone.position.x = plate.x * DESIGN.CELL + DESIGN.CELL / 2;
        self.clone.position.z = plate.z * DESIGN.CELL + DESIGN.CELL / 2;
        self.clone.position.y = OBJECTS.PLATES.positionY;
        self.clone.name = this.name;
        self.scene.add(self.clone);
      });
    }

    loaderDispatchHelper(self.store, 'isPlatesBuild');
  }
}
