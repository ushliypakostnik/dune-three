export type TPosition = {
  x: number;
  z: number;
};
export type TPositions = Array<TPosition>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TConfig = { [key: string]: any };

type TMessagesLanguageField = string | { [key: string]: string };
type TMessagesLanguage = { [key: string]: TMessagesLanguageField };

export type TMessages = {
  en: TMessagesLanguage;
  ru: TMessagesLanguage;
};
