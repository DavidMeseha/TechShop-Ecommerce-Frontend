import "react-toastify/dist/ReactToastify.css";
import { ReactElement } from "react";
import "@/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import { languages, seoLanguages } from "@/common/lib/utils";
import { getCurrentPath } from "@/common/lib/server-only/serverPathname";
import { Language } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

function generateLanguageAlternates(pathname: string) {
  const pathParts = pathname.split("/");
  const currentLang = pathParts[1] || "en";
  const cleanPath = pathParts.slice(2).join("/");

  return {
    canonical: cleanPath ? `${baseUrl}/${currentLang}/${cleanPath}` : `${baseUrl}/${currentLang}`,
    languages: languages.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: cleanPath ? `${baseUrl}/${lang}/${cleanPath}` : `${baseUrl}/${lang}`
      }),
      {}
    )
  };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Language }> }) {
  const { pathname } = await getCurrentPath();
  const { canonical, languages } = generateLanguageAlternates(pathname);
  const { lang } = await params;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "TechShop - Your Social Tech Store",
      template: "%s | TechShop"
    },
    description: "Discover tech products through social interaction at TechShop",
    openGraph: {
      type: "website",
      siteName: "TechShop",
      title: "TechShop - Your Social Tech Store",
      description: "Discover tech products through social interaction at TechShop",
      url: baseUrl,
      locale: seoLanguages.filter((language) => language.lang === lang).map((language) => language.locale),
      alternateLocale: [...seoLanguages.filter((language) => language.lang !== lang).map((language) => language.locale)]
    },
    verification: {
      google: "LNXuD0OB-K9UiZBq_wJGKs72Ypb6eJ2Y1I-GvhN7a_o"
    },
    alternates: {
      canonical,
      languages
    },
    other: {
      "google-site-verification": "LNXuD0OB-K9UiZBq_wJGKs72Ypb6eJ2Y1I-GvhN7a_o"
    }
  };
}

export default async function RootLayout({ children }: { children: ReactElement<any> }) {
  return children;
}
