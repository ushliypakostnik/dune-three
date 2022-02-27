// Assets Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Names, Colors, Textures } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { Texture, MeshPhongMaterial } from 'three';

// Utils
import { getTextureByName } from '@/utils/utilities';

export default class Assets {
  private _concrette!: Texture;
  private _metall!: Texture;
  private _glass!: Texture;
  private _sand!: Texture;
  private _plates!: Texture;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public init(self: ISelf) {
    this._concrette = self.helper.setMapHelper(self, Textures.concrette);
    this._metall = self.helper.setMapHelper(self, Textures.metall);
    this._glass = self.helper.setMapHelper(self, Textures.glass);
    this._sand = self.helper.setMapHelper(self, Textures.sand);
    this._plates = self.helper.setMapHelper(self, Textures.plates);
  }

  public getTexture(name: Names | Textures): Texture {
    const n = name in Names ? getTextureByName(name as Names) : name;
    switch (n) {
      case Textures.concrette:
        return this._concrette;
        break;
      case Textures.metall:
        return this._metall;
        break;
      case Textures.glass:
        return this._glass;
        break;
      case Textures.sand:
        return this._sand;
        break;
      case Textures.plates:
        return this._plates;
        break;
    }
    return this._concrette;
  }

  public getMaterial(name: Textures): MeshPhongMaterial {
    switch (name) {
      case Textures.concrette:
        return new THREE.MeshPhongMaterial({
          map: this.getTexture(name),
          color: Colors[name as keyof typeof Colors],
        });
        break;
    }
    return new THREE.MeshPhongMaterial({
      map: this.getTexture(name),
      color: Colors[name as keyof typeof Colors],
    });
  }
}
