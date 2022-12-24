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
  private _metall2!: Texture;
  private _glass!: Texture;
  private _sand!: Texture;
  private _sand2!: Texture;
  private _plates!: Texture;
  private _player!: Texture;

  // Audios
  private _command!: AudioBuffer;
  private _stations!: AudioBuffer;
  private _plants!: AudioBuffer;
  private _storages!: AudioBuffer;
  private _factories!: AudioBuffer;
  // private _tanks!: AudioBuffer;

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
    this._metall2 = self.helper.setMapHelper(self, Textures.metall2);
    this._glass = self.helper.setMapHelper(self, Textures.glass);
    this._sand = self.helper.setMapHelper(self, Textures.sand);
    this._sand2 = self.helper.setMapHelper(self, Textures.sand2);
    this._plates = self.helper.setMapHelper(self, Textures.plates);
    this._player = self.helper.setMapHelper(self, Textures.player);

    // Audio
    self.helper.setAudioToHeroHelper(self, Audios.wind);
    self.helper.setAudioToHeroHelper(self, Audios.zero);
    self.helper.setAudioToHeroHelper(self, Audios.build);
    self.helper.setAudioToHeroHelper(self, Audios.add);
    self.helper.setAudioToHeroHelper(self, Audios.sell);

    // Objects

    this.audioLoader.load(`./audio/${Audios.command}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(
        self.store,
        `${Audios.command}AudioIsLoaded`,
      );
      this._command = buffer;
      self.audio.initAudioByName(self, Audios.command);
    });

    this.audioLoader.load(`./audio/${Audios.stations}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(
        self.store,
        `${Audios.stations}AudioIsLoaded`,
      );
      this._stations = buffer;
      self.audio.initAudioByName(self, Audios.stations);
    });

    this.audioLoader.load(`./audio/${Audios.plants}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(
        self.store,
        `${Audios.plants}AudioIsLoaded`,
      );
      this._plants = buffer;
      self.audio.initAudioByName(self, Audios.plants);
    });

    this.audioLoader.load(`./audio/${Audios.storages}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(
        self.store,
        `${Audios.storages}AudioIsLoaded`,
      );
      this._storages = buffer;
      self.audio.initAudioByName(self, Audios.storages);
    });

    this.audioLoader.load(`./audio/${Audios.factories}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(
        self.store,
        `${Audios.factories}AudioIsLoaded`,
      );
      this._factories = buffer;
      self.audio.initAudioByName(self, Audios.factories);
    });

    /*
    this.audioLoader.load(`./audio/${Audios.tanks}.mp3`, (buffer) => {
      self.helper.loaderDispatchHelper(
        self.store,
        `${Audios.tanks}AudioIsLoaded`,
      );
      this._tanks = buffer;
      self.audio.initAudioByName(self, Audios.tanks);
    });
    */
  }

  // Получить текстуру
  public getTexture(name: Names | Textures): Texture {
    const n = name in Names ? getTextureByName(name as Names) : name;
    switch (n) {
      case Textures.concrette:
        return this._concrette;
      case Textures.metall:
        return this._metall;
      case Textures.metall2:
        return this._metall2;
      case Textures.glass:
        return this._glass;
      case Textures.sand:
        return this._sand;
      case Textures.sand2:
      case Textures.spice:
        return this._sand2;
      case Textures.plates:
        return this._plates;
      case Textures.player:
        return this._player;
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
      case Textures.hole:
        return new THREE.MeshPhongMaterial({
          color: Colors.black,
        });
      case Textures.spice:
        return new THREE.MeshPhongMaterial({
          color: Colors.spice,
          opacity: 0.33,
          transparent: true,
        });
    }
    return new THREE.MeshPhongMaterial({
      map: this.getTexture(name),
      color: Colors[name as keyof typeof Colors],
    });
  }

  // Получить звук
  public getAudio(name: Audios): AudioBuffer {
    switch (name) {
      case Audios.command:
        return this._command;
      case Audios.stations:
        return this._stations;
      case Audios.plants:
        return this._plants;
      case Audios.storages:
        return this._storages;
      case Audios.factories:
        return this._factories;
      /* case Audios.tanks:
        return this._tanks; */
    }
    return this._plants;
  }
}
