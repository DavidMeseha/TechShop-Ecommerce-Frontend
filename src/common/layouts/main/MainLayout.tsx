"use client";

import AllOverlays from "@/common/components/AllOverlays";
import React from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import TopMobileNav from "./TopMobileNav";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <>
      <AllOverlays />
      <Header />
      {pathname.includes("/feeds") ? null : <TopMobileNav />}
      <main className="relative mx-0 mb-14 w-full max-w-screen-xl pb-6 md:mx-auto md:px-4">{children}</main>
      <BottomNav />
    </>
  );
}
