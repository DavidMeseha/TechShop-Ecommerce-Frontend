"use client";

import { TranslationProvider } from "@/common/context/Translation";
import { Language, Translation } from "@/types";
import { ReactNode, useEffect } from "react";
import NetworkErrors from "@/common/components/utils/NetworkErrors";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAppStore } from "@/common/stores/appStore";
import TanstackQuery from "@/common/context/TanstackQuery";
import ProgressBar from "@/common/components/utils/ProgressBar";
import ReactScan from "@/common/components/utils/ReactScan";
import UserHandler from "@/common/context/User";

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
            <UserHandler>
              <ReactScan />
              {children}
            </UserHandler>
          </NetworkErrors>
        </TranslationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </TanstackQuery>
    </ProgressBar>
  );
}
