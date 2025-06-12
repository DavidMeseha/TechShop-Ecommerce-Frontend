import "server-only";
import api from "@/lib/axios";
import { cookies } from "next/headers";

export default async function createServerService() {
  const token = (await cookies()).get("token")?.value;
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  return { token };
}
