import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "../../components/layout/MainLayout";
import { Dictionaries, getDictionary, langs, Translation } from "../../dictionary";
import { Metadata } from "next";
import React, { ReactElement } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/globals.css";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "Ticktock Shop",
  description: "an ecommerce shop in the way of social media",
  openGraph: {
    type: "website",
    title: "Ticktock Shop",
    description: ""
  }
};

export async function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: ReactElement;
  params: { lang: Dictionaries };
}) {
  const dictionary: Translation = await getDictionary(params.lang);

  return (
    <html className="snap-both snap-mandatory" dir={params.lang === "ar" ? "rtl" : "ltr"} lang={params.lang}>
      <body
        className={`w-auto overflow-x-hidden md:w-screen ${params.lang === "ar" ? "md:ms-4" : ""} md:pr-4`}
        dir="ltr"
      >
        <div dir={params.lang === "ar" ? "rtl" : "ltr"}>
          <MainLayout dictionary={dictionary} lang={params.lang}>
            {children}
            <ToastContainer />
          </MainLayout>
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
