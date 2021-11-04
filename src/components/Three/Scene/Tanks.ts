import * as THREE from 'three';

// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, AnimatedModule } from '@/models/modules';

// Utils
import { getUniqueRandomPosition } from '@/utils/utilities';

export class Tanks extends AnimatedModule {
  constructor() {
    super();
  }

  init(self: ISelf): void {
    const geometry = new THREE.BoxGeometry(
      OBJECTS.TANKS.size,
      OBJECTS.TANKS.size,
      OBJECTS.TANKS.size,
    );
    const material = new THREE.MeshPhongMaterial();
    material.color.set(0x000000);

    self.mesh = new THREE.Mesh(geometry, material);
    self.mesh.position.y = OBJECTS.TANKS.size / 2;

    self.positions = [];
    for (let i = 0; i < OBJECTS.TANKS.quantity; i++) {
      self.clone = self.mesh.clone();
      self.position = getUniqueRandomPosition(
        self.positions,
        0, // TODO: магическое число!!!
        0, // TODO: магическое число!!!
        OBJECTS.TANKS.size * 4,
        100, // TODO: магическое число!!!
      );
      self.clone.position.x = self.position[0];
      self.clone.position.z = self.position[1];
      self.positions.push(self.position);
      self.scene.add(self.clone);
    }
  }

  animate(self: ISelf): void {
    // console.log('Tanks');
  }
}
