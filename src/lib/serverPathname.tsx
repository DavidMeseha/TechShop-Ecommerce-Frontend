"server-only";

import { headers } from "next/headers";
import { getPathnameLang } from "./misc";

export async function getCurrentPath() {
  const headersList = await headers();
  const path = headersList.get("x-invoke-path");
  const pathname = headersList.get("x-pathname");
  const lang = getPathnameLang(pathname ?? "");

  return {
    fullPath: path || "",
    pathname: pathname || "",
    isRoot: pathname === "/",
    segments: pathname?.split("/").filter(Boolean) || [],
    lang
  };
}
