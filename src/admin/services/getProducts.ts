import { IFullProduct } from "@/types";
import api from "./api/adminApi.config";
import { PaginatedResponse } from "./types";

export default async function getProducts(params: {
  page: number;
  limit: number;
  query: string;
  vendor?: string;
  category?: string;
}) {
  return api.get<PaginatedResponse<IFullProduct>>("/api/v1/admin/products", { params }).then((data) => data.data);
}
