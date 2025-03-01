import { ToastContainer } from "react-toastify";
import MainLayout from "@/components/layout/MainLayout";
import React, { ReactElement } from "react";
import { cookies } from "next/headers";
import { Language } from "@/types";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function Layout({ children }: { children: ReactElement; params: { lang: Language } }) {
  const token = cookies().get("session")?.value;

  return (
    <>
      <MainLayout token={token}>
        {children}
        <ToastContainer />
      </MainLayout>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
