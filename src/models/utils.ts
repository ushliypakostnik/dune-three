export type TPosition = {
  x: number;
  z: number;
};
export type TPositions = Array<TPosition>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TConfig = { [key: string]: any };

type TMessagesLanguage = { [key: string]: string };
export type TMessages = {
  en: TMessagesLanguage;
  ru: TMessagesLanguage;
};
