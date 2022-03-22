import type { Audio } from 'three';

export type TPosition = {
  x: number;
  z: number;
};
export type TPositions = Array<TPosition>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TConfig = { readonly [key: string]: any };

type TMessagesLanguage = { [key: string]: string };
export type TMessages = {
  readonly en: TMessagesLanguage;
  readonly ru: TMessagesLanguage;
};

export type TEventsData = number | null | undefined;
export type TEvents = {
  id: number;
  time: number;
  delay: number;
  data: TEventsData;
  callback: (data: TEventsData) => void;
};

export type TAudio = {
  id: string;
  name: string;
  audio: Audio;
  isStopped: boolean;
};

export type TStone = {
  x: number;
  z: number;
  h: number;
};
export type TSpice = {
  id: string;
  x: number;
  z: number;
  health: number;
};
export type TMountain = Array<TStone | TPosition>;
