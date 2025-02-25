import axios from "@/lib/axios";
import { RegisterFormInputs } from "@/schemas/valdation";
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

export async function changeUserPassword(form: { original: string; new: string }) {
  return axios.post("/api/user/ChangePassword", {
    password: form.original,
    newPassword: form.new
  });
}

export async function registerUser(payload: RegisterFormInputs) {
  return axios.post<{ message: string }>("/api/auth/register", { ...payload });
}
