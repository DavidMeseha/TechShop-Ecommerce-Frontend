import { User } from "@/types";

export default async function initClient() {
  try {
    const res = await fetch("/api/initUser", { method: "GET" });
    if (!res.ok) return null;
    const data = (await res.json()) as User & { token: string };
    return data;
  } catch {
    return null;
  }
}
