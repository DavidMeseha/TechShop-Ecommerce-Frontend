import api from "./api/adminApi.config";

export async function deleteProduct(id: string) {
  return api.delete(`/api/v1/admin/delete/product/${id}`).then((res) => res.data);
}

export async function republishProduct(id: string) {
  return api.post(`/api/v1/admin/republish/product/${id}`).then((res) => res.data);
}
