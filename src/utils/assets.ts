// Assets Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Names, Colors, Textures, Audios } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { Texture, MeshPhongMaterial, AudioLoader } from 'three';

// Utils
import { getTextureByName } from '@/utils/utilities';

// Modules
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Assets {
  // Textures
  private _concrette!: Texture;
  private _metall!: Texture;
  private _glass!: Texture;
  private _sand!: Texture;
  private _plates!: Texture;

  // Loaders
  public GLTFLoader: GLTFLoader;
  public audioLoader: AudioLoader;
  public textureLoader: THREE.TextureLoader;

  constructor() {
    this.GLTFLoader = new GLTFLoader();
    this.audioLoader = new THREE.AudioLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public init(self: ISelf) {
    // Textures
    this._concrette = self.helper.setMapHelper(self, Textures.concrette);
    this._metall = self.helper.setMapHelper(self, Textures.metall);
    this._glass = self.helper.setMapHelper(self, Textures.glass);
    this._sand = self.helper.setMapHelper(self, Textures.sand);
    this._plates = self.helper.setMapHelper(self, Textures.plates);

    // Audio
    self.helper.setAudioHelper(self, Audios.wind);
    self.helper.setAudioHelper(self, Audios.zero);
    self.helper.setAudioHelper(self, Audios.build);
    self.helper.setAudioHelper(self, Audios.add);
    self.helper.setAudioHelper(self, Audios.sell);
  }

  // Получить текстуру
  public getTexture(name: Names | Textures): Texture {
    const n = name in Names ? getTextureByName(name as Names) : name;
    switch (n) {
      case Textures.concrette:
        return this._concrette;
      case Textures.metall:
        return this._metall;
      case Textures.glass:
        return this._glass;
      case Textures.sand:
        return this._sand;
      case Textures.plates:
        return this._plates;
    }
    return this._concrette;
  }

  // Получить материал
  public getMaterial(name: Textures): MeshPhongMaterial {
    switch (name) {
      case Textures.concrette:
        return new THREE.MeshPhongMaterial({
          map: this.getTexture(name),
          color: Colors[name as keyof typeof Colors],
        });
    }
    return new THREE.MeshPhongMaterial({
      map: this.getTexture(name),
      color: Colors[name as keyof typeof Colors],
    });
  }
}
