"use client";

import { TranslationProvider } from "@/context/Translation";
import { Language, Translation } from "@/types";
import { ReactNode, useEffect } from "react";
import NetworkErrors from "@/components/util/NetworkErrors";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAppStore } from "@/stores/appStore";
import TanstackQuery from "@/context/TanstackQuery";
import ProgressBar from "@/components/util/ProgressBar";
// import ReactScan from "@/components/util/ReactScan";

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
    <ProgressBar>
      <TanstackQuery>
        <TranslationProvider lang={lang} translation={dictionary}>
          <NetworkErrors>
            {/* <ReactScan /> */}
            {children}
          </NetworkErrors>
        </TranslationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </TanstackQuery>
    </ProgressBar>
  );
}
