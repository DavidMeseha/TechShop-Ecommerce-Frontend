import { type MiddlewareConfig, type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPathnameLang } from "./lib/misc";

export async function middleware(req: NextRequest) {
  let res: NextResponse = NextResponse.next();

  const { pathname } = req.nextUrl;
  const lang = req.cookies.get("lang")?.value ?? "en";

  const pathnameLang = getPathnameLang(pathname);
  const pathOnly = pathnameLang ? pathname.replace("/" + pathnameLang, "") : pathname;

  if (!pathnameLang || lang !== pathnameLang) {
    req.nextUrl.pathname = `/${lang}${pathOnly}`;
    return NextResponse.redirect(req.nextUrl);
  }

  return res;
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|images|sitemap.xml|robots.txt|en/|ar/|fr/|en|ar|fr).*)"
  ]
};
