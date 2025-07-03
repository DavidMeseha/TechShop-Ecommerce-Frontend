import "server-only";
import api from "@/admin/services/api/adminApi.config";
import { cookies } from "next/headers";

export default async function configureAdminServerRequest() {
  const token = (await cookies()).get("token")?.value;
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  return { token };
}
