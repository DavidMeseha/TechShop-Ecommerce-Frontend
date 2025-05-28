import axios from "@/lib/axios";
import { LoginForm, RegisterForm } from "@/schemas/valdation";
import { User } from "@/types";

export async function checkTokenValidity() {
  return axios.get<User>("/api/v2/auth/check").then((res) => res.data);
}

export async function getGuestToken() {
  return axios.get<{ user: User; token: string }>("/api/v2/auth/guest");
}

export async function refreshToken() {
  return axios.get<{ token: string }>("/api/v2/auth/refreshToken");
}

export async function changeUserPassword(form: { original: string; new: string }) {
  return axios.post("/api/v2/user/ChangePassword", {
    password: form.original,
    newPassword: form.new
  });
}

export async function registerUser(payload: RegisterForm) {
  return axios.post<{ message: string }>("/api/v2/auth/register", { ...payload });
}

export async function login(payload: LoginForm) {
  return axios
    .post<{ user: User; token: string; expiry: number }>("/api/v2/auth/login", { ...payload })
    .then((res) => res.data);
}
