// Root

// Constants
import { Names } from '@/utils/constants';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStore {}

interface IStoreModule extends IStore {
  [key: string]: any;
}

// Common

export type TFieldPayload = {
  field: string;
  value: any;
};

// Preloader

type TPreloaderField = boolean;
export interface IPreloader extends IStore {
  [key: string]: TPreloaderField;
}

// Layout

export type TLanguage = string | null;

type TControlCoords = {
  x: number | null;
  y: number | null;
  z: number | null;
};
export type TControls = {
  camera: TControlCoords;
  target: TControlCoords;
};

export type TEventMessagePayload = {
  id: number;
  text: string;
};

export interface ILayout extends IStoreModule {}

// Objects

export interface IObjects extends IStoreModule {}

export type TObject = {
  name: Names;
  id: string;
  data: IStoreModule;
};
export type TObjectField = Array<TObject>;
export type TObjectsPayload = { name: string; objects: TObjectField };

export type TSellPayload = {
  name: Names;
  x: number;
  z: number;
};

export type TGrid = { [key: string]: Array<string> };
