import AppProviders from "@/common/layouts/AppProvidersLayout";
import { getDictionary } from "@/common/services/server/translation.service";
import { languages } from "@/common/lib/utils";
import { Language } from "@/types";
import { ReactNode } from "react";
import MainLayout from "@/common/layouts/main/MainLayout";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function Layout({
  params,
  children
}: {
  children: ReactNode;
  params: Promise<{ lang: Language }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <html className="snap-both snap-mandatory" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <body dir="ltr">
        <div dir={lang === "ar" ? "rtl" : "ltr"}>
          <AppProviders dictionary={dictionary} lang={lang}>
            <MainLayout>
              {children}
              <ToastContainer />
            </MainLayout>
            <Analytics />
            <SpeedInsights />
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
