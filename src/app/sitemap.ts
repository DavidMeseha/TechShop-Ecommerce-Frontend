import { languages } from "@/lib/misc";
import { MetadataRoute } from "next";
import { categoriesToGenerate, tagsToGenerate, vendorsToGenerate } from "@/services/server/staticGeneration.service";
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
    const [categories, products, tags, vendors] = await Promise.all([
      categoriesToGenerate(),
      homeFeedProducts({ page: 1, limit: 20 }),
      tagsToGenerate(),
      vendorsToGenerate()
    ]);

    return {
      categories: categories || [],
      products: products.data || [],
      tags: tags || [],
      vendors: vendors || []
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
  const { categories, products, tags, vendors } = await fetchDynamicRoutes();

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
    ...products.map((product) => createEntry(`/product/${product.seName}`, lang, 0.9, "daily")),

    // Categories
    ...categories.map((category) => createEntry(`/category/${category.seName}`, lang, 0.8, "weekly")),

    // Tags
    ...tags.map((tag) => createEntry(`/tag/${tag.seName}`, lang, 0.7, "weekly")),

    // Vendors
    ...vendors.map((vendor) => createEntry(`/vendor/${vendor.seName}`, lang, 0.8, "daily"))
  ]);

  return [...staticSitemapEntries, ...dynamicSitemapEntries];
}
