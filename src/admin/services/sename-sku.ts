import api from "../../common/services/api/adminApi.config";

export async function avilableSeNameAndSku(body: { name: string }) {
  return await api
    .post<{ seName: string; sku: string }>("/api/v1/admin/create/productUniques", { ...body })
    .then((data) => data.data);
}

export async function avilableVendorSename(body: { name: string }) {
  return await api.post<{ seName: string }>("/api/v1/create/vendorSeName", { ...body }).then((data) => data.data);
}
