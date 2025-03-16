import AppProviders from "@/components/layouts/AppProviders";
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
  const lang = (await params).lang;
  const dictionary = await getDictionary(lang);

  return (
    <html className="snap-both snap-mandatory" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <body className={`w-auto overflow-x-hidden md:w-screen ${lang === "ar" ? "md:ms-4" : ""} md:pr-4`} dir="ltr">
        <div dir={lang === "ar" ? "rtl" : "ltr"}>
          <AppProviders dictionary={dictionary} lang={lang}>
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
