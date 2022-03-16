// Events Helper
//////////////////////////////////////////////////////

// Constants
import { DESIGN } from '@/utils/constants';

// Types
import type { ISelf } from '@/models/modules';
import type { TEvents, TEventsData } from '@/models/utils';
import { Clock } from 'three';

export default class Events {
  private _clock: Clock;
  private _delta!: number;
  private _time: number;
  private _timer: number;

  private _bus!: Array<TEvents>;
  private _id!: number;
  private _pause!: number;

  constructor() {
    this._clock = new Clock(false);
    this._time = 0;
    this._timer = 0;

    this._bus = [];
    this._id = 1;
  }

  // Добавить запись
  public addEventsToBus(
    delay: number,
    data: TEventsData,
    callback: (data: TEventsData) => void,
  ): void {
    this._bus.push({
      id: this._id,
      time: 0,
      delay,
      data,
      callback,
    });
    ++this._id;
  }

  // Удалить запись
  private _removeEventsFromBus(id: number): void {
    // eslint-disable-next-line no-const-assign
    this._bus = this._bus.filter((record) => record.id !== id);
  }

  // Задержка события
  public delayDispatchHelper(
    delay: number,
    callback: (data: TEventsData) => void,
  ): void {
    this._pause = delay || DESIGN.ANIMATION_TIMEOUT / 1000;

    this.addEventsToBus(this._pause, null, (data) => callback(data));
  }

  // Помощник показа экранных сообщений
  public messagesByIdDispatchHelper(
    self: ISelf,
    text: string,
    delay?: number,
  ): void {
    this._pause = delay || DESIGN.MESSAGES_TIMEOUT / 1000;

    self.store
      .dispatch('game/showMessage', { id: this._id, text })
      .then(() => {
        this.addEventsToBus(this._pause, this._id, (data) => {
          self.store.dispatch('game/hideMessage', data);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public animate(self: ISelf): void {
    if (!this._clock.running) this.start(self);

    this._delta = this._clock.getDelta();
    this._timer += this._delta;
    this._time += this._delta;

    // Обновляем часы раз в секунду игрового времени
    if (this._timer >= 1) {
      this._timer = 0;
      self.store.dispatch('layout/setField', {
        field: 'clock',
        value: this._time,
      });
    }

    this._bus.forEach((record) => {
      record.time += this._delta;
      if (record.time > record.delay) {
        record.callback(record.data as number);
        this._removeEventsFromBus(record.id);
      }
    });
  }

  public pause(): void {
    if (this._clock.running) this._clock.stop();
  }

  public start(self: ISelf): void {
    if (!this._clock.running) {
      this._time = self.store.getters['layout/clock'];
      this._timer = 0;
      this._clock.start();
    }
  }
}
