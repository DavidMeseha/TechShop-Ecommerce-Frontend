"use client";

import AllOverlays from "@/components/overlays/AllOverlays";
import React, { useMemo } from "react";
import BottomNav from "./includes/BottomNav";
import Header from "./includes/Header";
import UserHandler from "@/context/UserProvider";
import axios from "@/lib/axios";
import TopMobileNav from "./includes/TopMobileNav";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
  token?: string;
}

export default function MainLayout({ children, token }: MainLayoutProps) {
  const pathname = usePathname();

  useMemo(() => {
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, []);

  return (
    <UserHandler token={token}>
      <AllOverlays />
      <Header />
      {pathname.includes("/feeds") ? null : <TopMobileNav />}
      <main className="relative mx-0 mb-14 w-full max-w-screen-xl pb-6 md:mx-auto md:px-4">{children}</main>
      <BottomNav />
    </UserHandler>
  );
}
