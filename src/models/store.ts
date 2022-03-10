// Root

// Constants
import { Names } from "@/utils/constants";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStore {}

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

export interface ILayout extends IStore {
  [key: string]: boolean | number | TControls | TLanguage;
}

// Objects

export type TObject = {
  name: Names;
  id: number;
  x: number;
  z: number;
  r: number;
  health: number;
};
export type TObjectField = Array<TObject>;
export type TObjectsPayload = { name: string; objects: TObjectField };

export interface IObjects extends IStore {
  [key: string]: any;
}
