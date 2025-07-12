import "server-only";
import adminApi from "@/common/services/api/adminApi.config";
import api from "@/common/services/api/api.config";
import { cookies } from "next/headers";

export default async function configureServerRequest() {
  const token = (await cookies()).get("token")?.value;
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  adminApi.defaults.headers.common.Authorization = `Bearer ${token}`;

  return { token };
}
