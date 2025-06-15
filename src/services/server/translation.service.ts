import "server-only";
import { Language, TranslationKey } from "../../types";

const dictionaries = {
  en: import("@/dictionaries/en.json").then((module) => module.default),
  ar: import("@/dictionaries/ar.json").then((module) => module.default),
  fr: import("@/dictionaries/fr.json").then((module) => module.default)
};

export const getDictionary = async (locale: Language) => await dictionaries[locale];
export const getServerTranslation = async (locale: Language) => {
  const dictionary = await dictionaries[locale];
  const t = (key: TranslationKey) => dictionary[key];
  return t;
};
