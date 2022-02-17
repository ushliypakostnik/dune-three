// Root
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStore {}

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

export type TFieldPayload = {
  field: string;
  value: boolean;
};

export interface ILayout extends IStore {
  [key: string]: boolean | TControls | TLanguage;
}

// Objects

export type TObject = {
  id: number;
  name: string;
  x: number;
  z: number;
  r: number;
  health: number;
};
export type TObjectField = Array<TObject>;
export type TObjectsPayload = { name: string; objects: TObjectField };

type TObjects = { [key: string]: Array<TObjectField> };
export interface IObjects extends IStore {
  objects: TObjects;
}
