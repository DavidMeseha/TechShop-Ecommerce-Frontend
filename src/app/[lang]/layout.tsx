import AppProviders from "@/components/layout/AppProviders";
import { getDictionary } from "@/dictionary";
import { languages } from "@/lib/misc";
import { Language } from "@/types";
import { ReactNode } from "react";

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function Layout({ params, children }: { children: ReactNode; params: { lang: Language } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <html className="snap-both snap-mandatory" dir={params.lang === "ar" ? "rtl" : "ltr"} lang={params.lang}>
      <head>
        <script async crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
      </head>
      <body
        className={`w-auto overflow-x-hidden md:w-screen ${params.lang === "ar" ? "md:ms-4" : ""} md:pr-4`}
        dir="ltr"
      >
        <div dir={params.lang === "ar" ? "rtl" : "ltr"}>
          <AppProviders dictionary={dictionary} lang={params.lang}>
            {children}
          </AppProviders>
        </div>
      </body>
    </html>
  );
}
