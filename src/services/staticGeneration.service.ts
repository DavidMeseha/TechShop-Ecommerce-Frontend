import { BASE_URL } from "@/lib/axios";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL
});

export async function tagsToGenerate() {
  try {
    const tags = await api.get<{ seName: string }[]>(`/api/catalog/allTags`).then((res) => res.data);
    return tags.map((tag) => ({
      seName: tag.seName
    }));
  } catch {
    return [];
  }
}

export async function vendorsToGenerate() {
  try {
    const vendors = await api.get<{ seName: string }[]>(`/api/catalog/allVendors`).then((res) => res.data);
    return vendors;
  } catch {
    return [];
  }
}

export async function categoriesToGenerate() {
  try {
    const categories = await api.get<{ seName: string }[]>(`/api/catalog/allCategories`).then((res) => res.data);
    return categories;
  } catch {
    return [];
  }
}
