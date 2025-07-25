"use server";

import { cookies } from "next/headers";
import axios from "@/common/services/api/api.config";
import { redirect } from "next/navigation";
import { Language } from "@/types";
import { getPathnameLang } from "@/common/lib/utils";

export async function setLanguage(lang: Language) {
  (await cookies()).set("lang", lang);
}

export async function getLanguage() {
  return ((await cookies()).get("lang")?.value ?? "en") as Language;
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

export async function setToken(token: string) {
  const cookiesStore = await cookies();
  await removeToken();
  cookiesStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/"
  });

  return;
}

export async function getToken() {
  return (await cookies()).get("token")?.value.toString();
}

export async function removeToken() {
  const cookieDelete = (await cookies()).delete;
  cookieDelete("token");
  return;
}
