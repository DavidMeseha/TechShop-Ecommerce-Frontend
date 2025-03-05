import { languages } from "@/lib/misc";
import { MetadataRoute } from "next";
import axios from "@/lib/axios";
import { ICategory, IFullProduct, ITag, IVendor } from "@/types";

const baseUrl = "https://techshop-commerce.vercel.app";

// Static routes configuration
const staticRoutes = {
  main: ["login", "register", "feeds"],
  discover: ["discover/categories", "discover/tags", "discover/vendors"]
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
      axios.get<ICategory[]>("/api/common/categories").then((res) => res.data),
      axios.get<IFullProduct[]>("/api/common/products").then((res) => res.data),
      axios.get<ITag[]>("/api/common/tags").then((res) => res.data),
      axios.get<IVendor[]>("/api/common/vendors").then((res) => res.data)
    ]);

    return { categories, products, tags, vendors };
  } catch {
    return { categories: [], products: [], tags: [], vendors: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { categories, products, tags, vendors } = await fetchDynamicRoutes();

  // Generate static routes for all languages
  const staticSitemapEntries = languages.flatMap((lang) => [
    createEntry("", lang, 1, "daily"),
    ...staticRoutes.main.map((route) => createEntry(`/${route}`, lang, 0.8)),
    // Discovery pages
    ...staticRoutes.discover.map((route) => createEntry(`/${route}`, lang, 0.9, "daily"))
  ]);

  // Generate dynamic routes for all languages
  const dynamicSitemapEntries = languages.flatMap((lang) => [
    ...products.map((product) => createEntry(`/product/${product.seName}`, lang, 0.9, "daily")),
    ...categories.map((category) => createEntry(`/user/category/${category.seName}`, lang, 0.8)),
    ...tags.map((tag) => createEntry(`/user/tag/${tag.seName}`, lang, 0.7)),
    ...vendors.map((vendor) => createEntry(`/user/vendor/${vendor.seName}`, lang, 0.8, "daily"))
  ]);

  return [...staticSitemapEntries, ...dynamicSitemapEntries];
}
