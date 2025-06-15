import { languages } from "@/lib/misc";
import { MetadataRoute } from "next";
import { homeFeedProducts } from "@/services/catalog.service";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

// Static routes configuration
const staticRoutes = {
  auth: ["login", "register"],
  discover: ["categories", "tags", "vendors"]
};

// Default last modified date (today at midnight)
const defaultLastMod = new Date();
defaultLastMod.setHours(0, 0, 0, 0);

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

// Helper function to create sitemap entry
const createEntry = (
  path: string,
  lang: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"] = "weekly"
): SitemapEntry => ({
  url: `${baseUrl}/${lang}${path}`,
  lastModified: defaultLastMod,
  changeFrequency,
  priority
});

// Fetch data for dynamic routes
async function fetchDynamicRoutes() {
  try {
    const [products] = await Promise.all([homeFeedProducts({ page: 1, limit: 20 })]);

    return {
      products: products.data || []
    };
  } catch {
    return {
      categories: [],
      products: [],
      tags: [],
      vendors: []
    };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await fetchDynamicRoutes();

  // Generate static routes for all languages
  const staticSitemapEntries = languages.flatMap((lang) => [
    // Home page
    createEntry("", lang, 1, "daily"),

    // Auth pages
    ...staticRoutes.auth.map((route) => createEntry(`/${route}`, lang, 0.5, "monthly")),

    // Discovery pages
    ...staticRoutes.discover.map((route) => createEntry(`/${route}`, lang, 0.8, "daily"))
  ]);

  // Generate dynamic routes for all languages
  const dynamicSitemapEntries = languages.flatMap((lang) => [
    // Products
    ...products.map((product) => createEntry(`/product/${product.seName}`, lang, 0.9, "daily"))
  ]);

  return [...staticSitemapEntries, ...dynamicSitemapEntries];
}
