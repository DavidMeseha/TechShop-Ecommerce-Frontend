import "server-only";
import api from "@/lib/axios";

export async function tagsToGenerate() {
  try {
    const tags = await api.get<{ seName: string }[]>(`/api/v2/catalog/tag/all`).then((res) => res.data);
    return tags;
  } catch {
    return [];
  }
}

export async function vendorsToGenerate() {
  try {
    const vendors = await api.get<{ seName: string }[]>(`/api/v2/catalog/vendor/all`).then((res) => res.data);
    return vendors;
  } catch {
    return [];
  }
}

export async function categoriesToGenerate() {
  try {
    const categories = await api.get<{ seName: string }[]>(`/api/v2/catalog/category/all`).then((res) => res.data);
    return categories;
  } catch {
    return [];
  }
}
