import { ICategory } from "@/types";
import api from "../../common/services/api/adminApi.config";
import { Tag, Vendor } from "./types";

export async function findVendors(params: { query: string }) {
  return await api.get<Omit<Vendor, "user">[]>("/api/v1/admin/find/vendors", { params }).then((data) => data.data);
}

export async function findCategories(params: { query: string }) {
  return await api.get<ICategory[]>("/api/v1/admin/find/categories", { params }).then((data) => data.data);
}

export async function findTags(params: { query: string }) {
  return await api.get<Tag[]>("/api/v1/admin/find/tags", { params }).then((data) => data.data);
}
