"use client";

import AllOverlays from "@/components/overlays/AllOverlays";
import React, { useMemo } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import UserHandler from "@/context/UserProvider";
import axios from "@/lib/axios";
import TopMobileNav from "./TopMobileNav";
import { usePathname } from "next/navigation";
import { getToken } from "@/lib/token";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  useMemo(() => {
    // console.log("useEffect => ", token);
    axios.interceptors.request.clear();
    axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${getToken()}`;
      return config;
    });
  }, []);

  return (
    <UserHandler>
      <AllOverlays />
      <Header />
      {pathname.includes("/feeds") ? null : <TopMobileNav />}
      <main className="relative mx-0 mb-14 w-full max-w-screen-xl pb-6 md:mx-auto md:px-4">{children}</main>
      <BottomNav />
    </UserHandler>
  );
}
