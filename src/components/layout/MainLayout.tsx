"use client";

import AllOverlays from "@/components/overlays/AllOverlays";
import React, { useEffect, useState } from "react";
import BottomNav from "./includes/BottomNav";
import Header from "./includes/Header";
import SideNav from "./includes/SideNav";
import UserSetup from "@/context/UserProvider";
import axios from "@/lib/axios";

interface MainLayoutProps {
  children: React.ReactNode;
  token?: string;
}

export default function MainLayout({ children, token }: MainLayoutProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    setIsInitializing(false);
  }, []);

  if (isInitializing) return null;

  return (
    <>
      <UserSetup token={token}>
        <AllOverlays />
        <Header />
        <main className="mx-auto flex w-full justify-between px-0">
          <SideNav />
          <div className="relative mx-auto my-11 w-full md:mx-0 md:ms-[230px] md:mt-[60px]">
            <div className="m-auto max-w-[1200px] md:px-4">{children}</div>
          </div>
        </main>
        <BottomNav />
      </UserSetup>
    </>
  );
}
