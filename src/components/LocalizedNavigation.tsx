"use client";

import Link, { LinkProps } from "next/link";
import { useTranslation } from "@/context/Translation";
import React from "react";
import { usePathname } from "next/navigation";

interface Props extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dir?: "ltr" | "rtl";
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
  return (
    <Link href={`/${lang}${href}`} scroll={false} {...props}>
      {children}
    </Link>
  );
}
