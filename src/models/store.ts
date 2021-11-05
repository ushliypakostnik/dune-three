// Root
export interface IStore {}

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

type TObject = { [key: string]: number[] };
export type TObjects = { [key: string]: Array<TObject> };

type TObjectField = Array<TObject>;
export type TObjectsPayload = { name: string; objects: TObjectField };

export interface IObjects extends IStore {
  objects: TObjects;
}
// @ts-ignore
