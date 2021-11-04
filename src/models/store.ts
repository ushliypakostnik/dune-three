// Root
export interface IStore {}

// Layout

export type Tlanguage = string;

export interface ILayout extends IStore {
  language: Tlanguage | null;
}
// @ts-ignore
