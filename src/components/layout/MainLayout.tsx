"use client";

import ProgressBarProvider from "@/context/ProgressBarProvider";
import AllOverlays from "@/components/overlays/AllOverlays";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect, useState } from "react";
import BottomNav from "./includes/BottomNav";
import { QueryClient } from "@tanstack/react-query";
import { TranslationProvider } from "@/context/Translation";
import axios from "@/lib/axios";
import Header from "./includes/Header";
import SideNav from "./includes/SideNav";
import NetworkErrors from "@/context/NetworkErrors";
import { Language, Translation } from "@/types";
import { useAppStore } from "@/stores/appStore";
import UserSetupWrapper from "./includes/UserSetupWrapper";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  }
});

interface MainLayoutProps {
  children: React.ReactNode;
  dictionary: Translation;
  lang: Language;
  token?: string;
}

export default function MainLayout({ children, dictionary, lang, token }: MainLayoutProps) {
  const { setCountries } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setCountries();
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    const configureAxios = () => {
      axios.interceptors.request.clear();
      axios.interceptors.request.use((config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });
      queryClient.invalidateQueries({ queryKey: ["checkToken"] });
    };

    configureAxios();
  }, [token]);

  if (isInitializing) {
    return null;
  }

  return (
    <ProgressBarProvider>
      <QueryClientProvider client={queryClient}>
        <TranslationProvider lang={lang} translation={dictionary}>
          <NetworkErrors>
            <UserSetupWrapper>
              <AllOverlays />
              <Header />
              <main className="mx-auto flex w-full justify-between px-0">
                <SideNav />
                <div className="relative mx-auto my-11 w-full md:mx-0 md:ms-[230px] md:mt-[60px]">
                  <div className="m-auto max-w-[1200px] md:px-4">{children}</div>
                </div>
              </main>
              <BottomNav />
            </UserSetupWrapper>
          </NetworkErrors>
        </TranslationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ProgressBarProvider>
  );
}
