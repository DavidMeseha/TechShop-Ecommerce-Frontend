"use client";

import { TranslationKey, Translation } from "@/types";
import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import { TFunction } from "@/types";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Language } from "@/types";

type Props = { translation: Translation; children: React.ReactNode; lang: Language };
type TContext = {
  t: TFunction;
  lang: Language;
  languages: ["en", "ar"];
};

const TranslationConetxt = createContext<TContext>({
  t: () => "",
  lang: "en",
  languages: ["en", "ar"]
});

export function TranslationProvider({ translation, children, lang }: Props) {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  const t = (key: TranslationKey) =>
    translation ? (key in translation ? translation[key as TranslationKey] : key) : key;

  useEffect(() => {
    if (message) toast.success(t(message as TranslationKey));
    if (error) toast.error(t(error as TranslationKey));
  }, [message, error, translation, lang]);

  return (
    <TranslationConetxt.Provider value={{ t, lang, languages: ["en", "ar"] }}>{children}</TranslationConetxt.Provider>
  );
}

export const useTranslation = () => useContext(TranslationConetxt);
