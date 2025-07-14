import { ProductForm } from "@/admin/schemas/valdation";
import api from "@/common/services/api/adminApi.config";

export async function createProduct(body: ProductForm) {
  return await api
    .post<{ id: string; message: string }>("/api/v1/admin/create/product", { ...body })
    .then((data) => data.data);
}

export async function editProduct(body: Partial<ProductForm>, id: string) {
  return await api
    .post<{ id: string; message: string }>("/api/v1/admin/edit/product/" + id, { ...body })
    .then((data) => data.data);
}
