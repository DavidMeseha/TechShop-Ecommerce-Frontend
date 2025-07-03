"use client";

import { useTranslation } from "@/common/context/Translation";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      <ul className="sticky top-11 z-30 flex w-full cursor-pointer border-b bg-white md:hidden">
        <li
          className={`w-full ${pathname.includes("/discover/vendors") ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
        >
          <LocalLink className="flex justify-center py-2" href="/discover/vendors">
            {t("discover.vendors")}
          </LocalLink>
        </li>
        <li
          className={`w-full ${pathname.includes("/discover/categories") ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
        >
          <LocalLink className="flex justify-center py-2" href="/discover/categories">
            {t("discover.categories")}
          </LocalLink>
        </li>
        <li
          className={`w-full ${pathname.includes("/discover/tags") ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
        >
          <LocalLink className="flex justify-center py-2" href="/discover/tags">
            {t("discover.tags")}
          </LocalLink>
        </li>
      </ul>
      {children}
    </>
  );
}
