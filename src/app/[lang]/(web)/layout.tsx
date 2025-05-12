import { ToastContainer } from "react-toastify";
import MainLayout from "@/components/layouts/main/MainLayout";
import React, { ReactElement } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <MainLayout>
        {children}
        <ToastContainer />
      </MainLayout>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
