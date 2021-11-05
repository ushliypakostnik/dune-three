export type TConfig = { [key: string]: any };

type TMessagesLanguage = { [key: string]: string };

export type TMessages = {
  en: TMessagesLanguage,
  ru: TMessagesLanguage,
};

export type TPosition = {
  x: number,
  z: number,
};

export type TPositions = Array<TPosition>;
