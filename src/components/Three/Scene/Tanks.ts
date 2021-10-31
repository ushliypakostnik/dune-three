import * as THREE from 'three';
import { Scene, Mesh } from 'three';

import { IAnimatedModule } from '@/models/modules';

export class Tanks implements IAnimatedModule {
  private tank: Mesh;
  private direction: number;

  constructor() {
    this.tank = new THREE.Mesh();
    this.direction = 1;
  }

  init(scene: Scene): void {
    this.direction = 1;

    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial();
    material.color.set(0x000000);

    this.tank = new THREE.Mesh(geometry, material);
    this.tank.position.y = 5;
    scene.add(this.tank);
  }

  animate(): void {
    this.tank.position.x += this.direction;
    this.tank.position.z += this.direction;

    if (this.tank.position.x > 100 || this.tank.position.x < -100)
      this.direction *= -1;
  }
}
