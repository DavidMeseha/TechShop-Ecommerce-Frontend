"use client";

import Link, { LinkProps } from "next/link";
import { useTranslation } from "@/context/Translation";
import React from "react";
import { usePathname } from "next/navigation";

type Routes =
  | "/"
  | "/login"
  | "/register"
  | "/cart"
  | "/feeds"
  | "/user/me"
  | "/user/addresses"
  | "/user/orders"
  | "/user/reviews"
  | "/user/following"
  | "/discover/vendors"
  | "/discover/categories"
  | "/discover/tags"
  | "/user/addresses/edit"
  | "/user/addresses/add"
  | `/category/:seName`
  | `/product/:seName`
  | `/tag/:seName`
  | `/vendor/:seName`
  | `/user/order-details/:id`
  | `/user/order-success/:id`
  | "/user/addresses/edit/:id";

type DynamicRoutes =
  | `/category/${string}`
  | `/product/${string}`
  | `/tag/${string}`
  | `/vendor/${string}`
  | `/user/order-details/${string}`
  | `/user/order-success/${string}`
  | `/user/addresses/edit/${string}`;

export type AppRoutes = DynamicRoutes | Routes;

interface Props extends Omit<LinkProps, "href"> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dir?: "ltr" | "rtl";
  href: AppRoutes;
}

export function useLocalPathname() {
  const pathname = usePathname();
  const params = [...pathname.split("/")];
  params.shift();
  const lang = params.shift();
  return { lang, pathname: "/" + params.join("/") };
}

export function LocalLink({ href, children, ...props }: Props) {
  const { lang } = useTranslation();

  if (href.includes(":")) throw new Error("You should replace the route segmant with it's value");

  return (
    <Link href={`/${lang}${href}`} hrefLang={lang} scroll={true} {...props}>
      {children}
    </Link>
  );
}
