"use server";

import { cookies } from "next/headers";
import axios from "./lib/axios";
import { redirect } from "next/navigation";
import { Language } from "./types";
import { getPathnameLang } from "./lib/misc";

export async function setToken(token: string) {
  (await cookies()).set("token", token, { httpOnly: true, sameSite: "strict", secure: true });
}

export async function removeToken() {
  (await cookies()).delete("token");
}

export async function setLanguage(lang: Language) {
  (await cookies()).set("lang", lang);
}

export async function getLanguage() {
  return ((await cookies()).get("lang")?.value ?? "en") as Language;
}

export async function setUserCookies(token: string, lang: Language) {
  await setToken(token);
  await setLanguage(lang);
}

export async function changeLanguage(lang: Language, pathname: string) {
  const pathnameLang = getPathnameLang(pathname);
  const tempPath = pathname;
  const pathOnly = tempPath.replace("/" + pathnameLang, "");

  try {
    await axios.post(
      `/api/common/changeLanguage/${lang}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${(await cookies()).get("token")?.value}`,
          "Accept-Language": (await cookies()).get("lang")?.value
        }
      }
    );
    await setLanguage(lang);
  } catch {
    return redirect(pathname + "?error=couldNotChangeLanguage");
  }
  return redirect(`/${lang}${pathOnly}`);
}
