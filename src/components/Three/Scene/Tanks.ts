import * as THREE from 'three';
import { Mesh } from 'three';

// Constants
import { OBJECTS } from '@/utils/constants';

// Types
import { ISelf, AnimatedModule } from '@/models/modules';
import { TPosition } from '@/models/utils';

// Utils
import { getUniqueRandomPosition } from '@/utils/utilities';

export class Tanks extends AnimatedModule {
  private tank: Mesh;
  private tankClone: Mesh;
  private direction: number;
  private positions: Array<TPosition>;

  constructor() {
    super();

    this.tank = new THREE.Mesh();
    this.tankClone = new THREE.Mesh();
    this.direction = 1;
    this.positions = [];
  }

  init(self: ISelf): void {
    this.direction = 1;

    const geometry = new THREE.BoxGeometry(
      OBJECTS.TANKS.size,
      OBJECTS.TANKS.size,
      OBJECTS.TANKS.size,
    );
    const material = new THREE.MeshPhongMaterial();
    material.color.set(0x000000);

    this.tank = new THREE.Mesh(geometry, material);
    this.tank.position.y = OBJECTS.TANKS.size / 2;

    for (let i = 0; i < OBJECTS.TANKS.quantity; i++) {
      this.tankClone = this.tank.clone();
      const position = getUniqueRandomPosition(this.positions, OBJECTS.TANKS.size * 4);
      this.tankClone.position.x = position[0];
      this.tankClone.position.z = position[1];
      this.positions.push(position);
      self.scene.add(this.tankClone);
    }
  }

  animate(self: ISelf): void {
    // this.tank.position.x += this.direction;
    // this.tank.position.z += this.direction;

    // if (this.tank.position.x > 100 || this.tank.position.x < -100)
    //  this.direction *= -1;
  }
}
