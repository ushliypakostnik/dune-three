// Assets Helper
//////////////////////////////////////////////////////

// Constants
import { Names, Textures } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { Texture } from 'three';

// Utils
import { getTextureByName } from '@/utils/utilities';

export default class Assets {
  private _concrette!: Texture;
  private _sand!: Texture;
  private _plates!: Texture;

  public init(self: ISelf) {
    this._concrette = self.helper.setMapHelper(self, Textures.concrette);
    this._sand = self.helper.setMapHelper(self, Textures.sand);
    this._plates = self.helper.setMapHelper(self, Textures.plates);
  }

  public getTexture(name: Names): Texture {
    switch (getTextureByName(name)) {
      case Textures.concrette:
        return this._concrette;
        break;
      case Textures.sand:
        return this._sand;
        break;
      case Textures.plates:
        return this._plates;
        break;
    }
  }
}
