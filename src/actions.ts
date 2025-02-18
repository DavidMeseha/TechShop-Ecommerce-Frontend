"use server";

import { cookies } from "next/headers";
import axios from "./lib/axios";
import { redirect } from "next/navigation";
import { IVendor, Language, User } from "./types";
import { getPathnameLang, replacePathnameLang } from "./lib/misc";

const axiosConfig = () => {
  return {
    headers: {
      Authorization: `Bearer ${cookies().get("session")?.value}`,
      "Accept-Language": cookies().get("lang")?.value
    }
  };
};

export async function setToken(token: string) {
  cookies().set("session", token, { httpOnly: true, sameSite: "strict", secure: true });
}

export async function removeToken() {
  cookies().delete("session");
}

export async function setLanguage(lang: Language) {
  cookies().set("lang", lang);
}

export async function getLanguage() {
  return (cookies().get("lang")?.value ?? "en") as Language;
}

export async function logout(pathname: string) {
  try {
    await axios.post("/api/auth/logout", {}, axiosConfig());
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await setToken(guest.data.token);
    cookies().set("lang", "en");
  } catch {
    return redirect(pathname);
  }
  const redirectLink = replacePathnameLang("en", pathname);
  redirect(redirectLink + "?message=auth.successfullLogout");
}

export async function registerGuest(pathname: string) {
  try {
    const guest = await axios.get<{ user: User; token: string }>("/api/auth/guest");
    await setToken(guest.data.token);
  } catch {
    return redirect(pathname);
  }
  return redirect(pathname);
}

export async function getCartIds() {
  try {
    const res = await axios.get<{ product: string; quantity: number }[]>("/api/common/cart/ids", axiosConfig());
    return res.data;
  } catch {
    return [];
  }
}

export async function changeLanguage(lang: Language, pathname: string) {
  const pathnameLang = getPathnameLang(pathname);
  const tempPath = pathname;
  const pathOnly = tempPath.replace("/" + pathnameLang, "");

  try {
    await axios.post(`/api/common/changeLanguage/${lang}`, {}, axiosConfig());
    await setLanguage(lang);
  } catch {
    return redirect(pathname + "?error=couldNotChangeLanguage");
  }
  return redirect(`/${lang}${pathOnly}`);
}

export async function followings(pathanme: string) {
  try {
    const res = await axios.get<IVendor[]>("/api/user/followingVendors", axiosConfig());
    return res.data;
  } catch {
    return redirect(pathanme + "?error=faildToSubmitYourAction");
  }
}
