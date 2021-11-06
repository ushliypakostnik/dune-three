import * as THREE from 'three';

// Constants
import {DESIGN, OBJECTS} from '@/utils/constants';

// Types
import { ISelf, AnimatedModule } from '@/models/modules';

// Utils
import {
  randomInteger,
  degreesToRadians,
  getUniqueRandomPosition,
} from '@/utils/utilities';

export class PlayerUnits extends AnimatedModule {
  constructor() {
    super(OBJECTS.STORE.PLAYERUNITS.name);
  }

  init(self: ISelf): void {
    const geometry = new THREE.BoxGeometry(
      OBJECTS.STORE.PLAYERUNITS.size,
      OBJECTS.STORE.PLAYERUNITS.size,
      OBJECTS.STORE.PLAYERUNITS.size,
    );
    const material = new THREE.MeshPhongMaterial();
    material.color.set(DESIGN.COLORS.panels);

    self.mesh = new THREE.Mesh(geometry, material);
    self.mesh.position.y = OBJECTS.STORE.PLAYERUNITS.size / 2;

    self.objects = [...self.store.getters['objects/objects'][this.name]];

    if (self.objects && self.objects.length === 0) {
      self.positions = [];
      for (let i = 0; i < OBJECTS.STORE.PLAYERUNITS.quantity; i++) {
        self.clone = self.mesh.clone();
        self.position = getUniqueRandomPosition(
          self.positions,
          0, // TODO: магическое число!!!
          0, // TODO: магическое число!!!
          OBJECTS.STORE.PLAYERUNITS.size * 5,
          100, // TODO: магическое число!!!
        );
        self.clone.position.x = self.position.x;
        self.clone.position.z = self.position.z;

        self.rotate = degreesToRadians(randomInteger(-1, 360));
        self.clone.rotateY(self.rotate);

        self.positions.push(self.position);
        self.scene.add(self.clone);
        self.objects.push({
          id: self.clone.id,
          x: self.position.x,
          z: self.position.z,
          r: self.rotate,
        });
      }
      self.store.dispatch('objects/saveObjects', {
        name: this.name,
        objects: self.objects,
      });
    } else {
      for (let i = 0; i < OBJECTS.STORE.PLAYERUNITS.quantity; i++) {
        self.clone = self.mesh.clone();
        self.clone.position.x = self.objects[i].x;
        self.clone.position.z = self.objects[i].z;
        self.clone.rotateY(self.objects[i].r);
        self.scene.add(self.clone);
      }
    }
  }

  animate(self: ISelf): void {
    // console.log('Tanks');
  }
}
