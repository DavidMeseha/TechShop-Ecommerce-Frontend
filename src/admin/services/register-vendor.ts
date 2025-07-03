import api from "./api/adminApi.config";

export type RegisterVendorBody = { name: string; seName: string; image: string };

export async function registerVendor(body: RegisterVendorBody) {
  return await api
    .post<{ message: string; vendorId: string }>("/api/v1/register/vendor", body)
    .then((data) => data.data);
}
