import { Translation } from "@/dictionary";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";
import MainLayout from "@/components/layout/MainLayout";
import { act, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TranslationProvider } from "@/context/Translation";
import React from "react";
import { Language, User } from "@/types";

const queryClient = new QueryClient();

const user: User = {
  _id: "xxx",
  email: "xxxxx@xxxx.xxx",
  firstName: "xxxx",
  lastName: "xxxx",
  imageUrl: "/images/placeholder.png",
  isLogin: true,
  isRegistered: true,
  isVendor: false,
  language: "en"
};

export const renderWithProviders = async (ui: React.ReactNode, lang: Language = "en", dictionary: Translation = en) => {
  return await act(async () =>
    render(
      <MainLayout dictionary={dictionary} lang={lang} token="xxxxx-xxxx-xxxx" user={user}>
        {ui}
      </MainLayout>
    )
  );
};

export const renderDiscoverPages = async (ui: React.ReactNode, lang: Language = "en", dictionary: Translation = en) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <TranslationProvider lang={lang} translation={dictionary}>
        {ui}
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export const renderWithTransation = async (
  ui: React.ReactNode,
  lang: Language = "en",
  dictionary: Translation = en
) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <TranslationProvider lang={lang} translation={dictionary}>
        {ui}
      </TranslationProvider>
    </QueryClientProvider>
  );
};

const dictionaries = {
  en: en,
  ar: ar
};

export const languages: Language[] = ["en", "ar"];
export const getDictionary = (lang: Language) => dictionaries[lang as keyof typeof dictionaries];
