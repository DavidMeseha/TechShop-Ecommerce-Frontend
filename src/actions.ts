"use server";

import { cookies } from "next/headers";
import axios from "./lib/axios";
import { redirect } from "next/navigation";
import { Language } from "./types";
import { getPathnameLang, replacePathnameLang } from "./lib/misc";
import { getGuestToken } from "./services/auth.service";

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
    const guest = await getGuestToken();
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
    const guest = await getGuestToken();
    await setToken(guest.data.token);
  } catch {
    return redirect(pathname);
  }
  return redirect(pathname);
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
