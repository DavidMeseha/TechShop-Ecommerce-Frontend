import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import React, { ReactElement } from "react";
import "@/globals.css";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  title: "TechShop",
  description: "an ecommerce shop in the way of social Interaction",
  openGraph: {
    type: "website",
    title: "TechShop",
    description: "an ecommerce description"
  },
  verification: {
    google: "LNXuD0OB-K9UiZBq_wJGKs72Ypb6eJ2Y1I-GvhN7a_o"
  },
  alternates: {
    canonical: "https://techshop-commerce.vercel.app",
    languages: {
      en: "/en",
      ru: "/ru",
      uk: "/uk"
    }
  }
};

export default async function RootLayout({ children }: { children: ReactElement }) {
  return <>{children}</>;
}
