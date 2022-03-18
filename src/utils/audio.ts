// Audio Helper
//////////////////////////////////////////////////////

import * as THREE from 'three';

// Constants
import { Colors, Audios } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { TAudio } from '@/models/utils';
import type { Audio, PositionalAudio, Mesh } from 'three';

// Utils
import { getVolumeByName } from '@/utils/utilities';
import { TObject } from '@/models/store';

export default class AudioBus {
  private _bus!: Array<TAudio>;
  private _heroSound!: Mesh;
  private _audio!: Audio;
  private _positionalAudio!: PositionalAudio;
  private _record?: TAudio;

  constructor() {
    this._bus = [];
  }

  init(self: ISelf): void {
    // Hero sound

    // Форма
    self.helper.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

    // Mатериал
    self.helper.material = new THREE.MeshStandardMaterial({
      color: Colors.white,
    });

    this._heroSound = new THREE.Mesh(
      self.helper.geometry,
      self.helper.material,
    );
    this._heroSound.visible = false;
    self.scene.add(this._heroSound);
  }

  // Добавить трек
  public addAudioToBus(
    id: string,
    audio: Audio,
    name: string,
    isLoop: boolean,
  ): void {
    if (!isLoop) audio.onEnded = () => audio.stop();

    this._bus.push({
      id,
      name,
      audio,
      isStopped: false,
    });
  }

  // Удалить трек
  private _removeAudioFromBus(id: string, name: string): void {
    this._bus = this._bus.filter(
      (record) => record.id !== id && record.name !== name,
    );
  }

  // Трек по айди и имени (позиционнированные аудио)
  private _getRecordByIdAndName(id: string, name: Audios): TAudio | undefined {
    return this._bus.find((record) => record.id === id && record.name === name);
  }

  // Трек по имени
  private _getRecordByName(name: Audios): TAudio | undefined {
    return this._bus.find((record) => record.name === name);
  }

  // Добавить трек на героя
  public addAudioToHero(
    self: ISelf,
    buffer: AudioBuffer,
    name: Audios,
    isLoop: boolean,
  ): void {
    this._audio = new THREE.Audio(self.listener);

    this._audio.setBuffer(buffer);
    this._audio.setVolume(getVolumeByName(name));
    this._audio.setLoop(isLoop);

    this.addAudioToBus(this._heroSound.uuid, this._audio, name, isLoop);

    this._heroSound.add(this._audio);
  }

  // Добавить трек на группу объектоа
  public addAudioToObjects(
    self: ISelf,
    objects: Array<TObject>,
    buffer: AudioBuffer,
    name: Audios,
    isLoop: boolean,
  ): void {
    objects.forEach((object) => {
      this._positionalAudio = new THREE.PositionalAudio(self.listener);

      this._positionalAudio.setBuffer(buffer);
      this._positionalAudio.setVolume(getVolumeByName(name));
      this._positionalAudio.setRefDistance(50);
      this._positionalAudio.setMaxDistance(200);
      this._positionalAudio.setLoop(isLoop);
      this._positionalAudio.setRolloffFactor(1);

      this.addAudioToBus(object.id, this._audio, name, isLoop);

      // TODO: проработать "куда и как добавляется аудио?"
      // object.add(this._positionalAudio);
    });
  }

  // Добавить и отыграть трек на одном объекте
  public playAudioOnObject(
    self: ISelf,
    object: TObject,
    buffer: AudioBuffer,
    name: Audios,
  ): void {
    this._positionalAudio = new THREE.PositionalAudio(self.listener);

    this._positionalAudio.setBuffer(buffer);
    this._positionalAudio.setVolume(getVolumeByName(name));
    this._positionalAudio.setRefDistance(50);
    this._positionalAudio.setMaxDistance(200);
    this._positionalAudio.setLoop(false);
    this._positionalAudio.setRolloffFactor(1);

    this.addAudioToBus(object.id, this._audio, name, false);

    // TODO: проработать "куда и как добавляется аудио?"
    // object.add(this._positionalAudio);
    this._positionalAudio.play();
    this._positionalAudio.onEnded = () => {
      if (this._positionalAudio && this._positionalAudio.isPlaying)
        this._positionalAudio.stop();
      this._removeAudioFromBus(object.id, name);
    };
  }

  // Пауза
  public toggle(isPause: boolean): void {
    if (isPause) {
      this._bus
        .filter((record) => record.audio.isPlaying)
        .forEach((record) => {
          record.isStopped = true;
          record.audio.pause();
        });
    } else {
      this._bus
        .filter((record) => record.isStopped)
        .forEach((record) => {
          record.isStopped = false;
          record.audio.play();
        });

      // Ветер
      if (
        this._bus.find(
          (record) => record.name === Audios.wind && !record.audio.isPlaying,
        )
      )
        this.startHeroSound(Audios.wind);
    }
  }

  // Получить звук на герое
  public getHeroSound(name: Audios): Audio {
    return this._getRecordByName(name)?.audio as Audio;
  }

  // Запустить звук на герое
  public startHeroSound(name: Audios): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio && !this._record.audio.isPlaying)
      this._record.audio.play();
  }

  // Остановить звук на герое
  public pauseHeroSound(name: Audios): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio && this._record.audio.isPlaying)
      this._record.audio.pause();
  }

  // Переиграть звук на герое
  public replayHeroSound(name: Audios): void {
    this._record = this._getRecordByName(name);
    if (this._record && this._record.audio) {
      if (this._record.audio.isPlaying) this._record.audio.stop();
      this._record.audio.play();
    }
  }

  // Запустить звук на объекте
  public startObjectSound(id: string, name: Audios): void {
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio && !this._record.audio.isPlaying) {
      this._record.audio.play();
    }
  }

  // Остановить звук на объекте
  public stopObjectSound(id: string, name: Audios): void {
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio && this._record.audio.isPlaying)
      this._record.audio.stop();
  }

  // Поставить на паузу на объекте
  public pauseObjectSound(id: string, name: Audios): void {
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio && this._record.audio.isPlaying)
      this._record.audio.pause();
  }

  // Переиграть звук на объекте
  public replayObjectSound(id: string, name: Audios): void {
    this._record = this._getRecordByIdAndName(id, name);
    if (this._record && this._record.audio) {
      if (!this._record.audio.isPlaying) {
        this._record.audio.play();
      } else {
        this._record.audio.stop();
        this._record.audio.play();
      }
    }
  }
}
