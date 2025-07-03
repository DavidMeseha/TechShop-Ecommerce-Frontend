"use client";

import AllOverlays from "@/common/components/AllOverlays";
import React from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import UserHandler from "@/common/context/User";
import TopMobileNav from "./TopMobileNav";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();

  return (
    <UserHandler>
      <AllOverlays />
      {(pathname.includes("/register") || pathname.includes("/login")) &&
      !pathname.includes("/admin/register") ? null : (
        <Header />
      )}
      {pathname.includes("/feeds") ? null : <TopMobileNav />}
      <main className="relative mx-0 mb-14 w-full max-w-screen-xl pb-6 md:mx-auto md:px-4">{children}</main>
      <BottomNav />
    </UserHandler>
  );
}
