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
};

const TranslationConetext = createContext<TContext | undefined>(undefined);

export function TranslationProvider({ translation, children, lang }: Props) {
  const t = (key: TranslationKey) =>
    translation ? (key in translation ? translation[key as TranslationKey] : key) : key;

  return <TranslationConetext.Provider value={{ t, lang }}>{children}</TranslationConetext.Provider>;
}

export const useTranslation = () => {
  const context = useContext(TranslationConetext);

  if (!context) throw new Error("useTranslation must be used within a TranslationProvider");
  return context;
};
