import axios from "@/lib/axios";
import { User } from "@/types";

export async function checkTokenValidity() {
  return axios.get<User>("/api/auth/check").then((res) => res.data);
}

export async function getGuestToken() {
  return axios.get<{ user: User; token: string }>("/api/auth/guest");
}

export async function refreshToken() {
  return axios.get<{ token: string }>("/api/auth/refreshToken");
}
