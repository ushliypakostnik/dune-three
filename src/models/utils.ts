export type TConfig = { [key: string]: any };

type TMessagesLanguageField = string | { [key: string]: string };
type TMessagesLanguage = { [key: string]: TMessagesLanguageField  };

export type TMessages = {
  en: TMessagesLanguage,
  ru: TMessagesLanguage,
};

export type TPosition = {
  x: number,
  z: number,
};

export type TPositions = Array<TPosition>;
