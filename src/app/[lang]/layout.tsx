import AppProviders from "@/components/layouts/AppProvidersLayout";
import { getDictionary } from "@/dictionary";
import { languages } from "@/lib/misc";
import { Language } from "@/types";
import { ReactNode } from "react";

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
  const now = new Date().toISOString();

  return (
    <html className="snap-both snap-mandatory" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <body className={`w-auto overflow-x-hidden md:w-screen ${lang === "ar" ? "md:ms-4" : ""} md:pr-4`} dir="ltr">
        <div dir={lang === "ar" ? "rtl" : "ltr"}>
          <AppProviders dictionary={dictionary} lang={lang}>
            {children}
          </AppProviders>
        </div>
        <div className="fixed start-0 top-0 z-[99] bg-white">
          <div>
            <p>Generated at: {now}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
