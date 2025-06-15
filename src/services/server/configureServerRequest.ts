import "server-only";
import api from "@/services/api/axios.config";
import { cookies } from "next/headers";

export default async function configureServerRequest() {
  const token = (await cookies()).get("token")?.value;
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  return { token };
}
