"use client";

import ProgressBarProvider from "@/context/ProgressBarProvider";
import { TranslationProvider } from "@/context/Translation";
import { Language, Translation } from "@/types";
import { ReactNode, useEffect } from "react";
import NetworkErrors from "./includes/NetworkErrors";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAppStore } from "@/stores/appStore";
import QueryProvider from "./includes/QueryProvider";

type Props = {
  children: ReactNode;
  dictionary: Translation;
  lang: Language;
};

export default function AppProvidrs({ children, dictionary, lang }: Props) {
  const setCountries = useAppStore((state) => state.setCountries);

  useEffect(() => {
    setCountries();
  }, []);

  return (
    <ProgressBarProvider>
      <QueryProvider>
        <TranslationProvider lang={lang} translation={dictionary}>
          <NetworkErrors>{children}</NetworkErrors>
        </TranslationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </ProgressBarProvider>
  );
}
