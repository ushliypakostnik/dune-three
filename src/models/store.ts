// Root
export interface IStore {}

// Preloader

type TPreloaderField = boolean;
export interface IPreloader extends IStore { [key: string]: TPreloaderField }

// Layout

export type Tlanguage = string | null;

export type TControls = {
  camera: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  target: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
};

export interface ILayout extends IStore {
  language: Tlanguage;
  controls: TControls;
}

// Objects

export type TObject = {
  id: number,
  x: number;
  z: number;
  r: number,
};
export type TObjectField = Array<TObject>;
export type TObjectsPayload = { name: string; objects: TObjectField };

type TObjects = { [key: string]: Array<TObjectField> };
export interface IObjects extends IStore {
  objects: TObjects;
}


