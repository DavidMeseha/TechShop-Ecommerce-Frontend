"use client";

import { TranslationProvider } from "@/context/Translation";
import { Language, Translation } from "@/types";
import { ReactNode, useEffect } from "react";
import NetworkErrors from "../../context/NetworkErrors";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAppStore } from "@/stores/appStore";
import QueryProvider from "../../context/QueryProvider";
import ProgressBarProvider from "@/context/ProgressBarProvider";
import ReactScan from "../../context/ReactScan";

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
          <NetworkErrors>
            <ReactScan />
            {children}
          </NetworkErrors>
        </TranslationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryProvider>
    </ProgressBarProvider>
  );
}
