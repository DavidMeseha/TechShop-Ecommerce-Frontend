"use client";

import { TranslationKey, Translation } from "@/types";
import React, { useContext } from "react";
import { createContext } from "react";
import { TFunction } from "@/types";
import { Language } from "@/types";

type Props = { translation: Translation; children: React.ReactNode; lang: Language };
type TContext = {
  t: TFunction;
  lang: Language;
  languages: ["en", "ar"];
};

const TranslationConetext = createContext<TContext>({
  t: () => "",
  lang: "en",
  languages: ["en", "ar"]
});

export function TranslationProvider({ translation, children, lang }: Props) {
  const t = (key: TranslationKey) =>
    translation ? (key in translation ? translation[key as TranslationKey] : key) : key;

  return (
    <TranslationConetext.Provider value={{ t, lang, languages: ["en", "ar"] }}>{children}</TranslationConetext.Provider>
  );
}

export const useTranslation = () => useContext(TranslationConetext);
