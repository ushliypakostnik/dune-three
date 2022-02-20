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
