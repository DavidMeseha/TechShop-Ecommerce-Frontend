"use client";

import BackArrow from "@/components/ui/BackArrow";
import { useTranslation } from "@/context/Translation";
import { useRouter } from "next-nprogress-bar";
import { LocalLink } from "@/components/LocalizedNavigation";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { BsSearch } from "react-icons/bs";
import { useOverlayStore } from "@/stores/overlayStore";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);
  const { t } = useTranslation();

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-30 w-full bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">{t("discover")}</h1>
          <button onClick={() => setIsSearchOpen(true)}>
            <BsSearch size={20} />
          </button>
        </div>
        <ul className="sticky top-11 z-30 flex w-full cursor-pointer items-center border-b bg-white">
          <li
            className={`w-full ${pathname.split("/")[pathname.split("/").length - 1] === "vendors" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
          >
            <LocalLink className="flex justify-center py-2" href="/discover/vendors">
              {t("discover.vendors")}
            </LocalLink>
          </li>
          <li
            className={`w-full ${pathname.split("/")[pathname.split("/").length - 1] === "categories" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
          >
            <LocalLink className="flex justify-center py-2" href="/discover/categories">
              {t("discover.categories")}
            </LocalLink>
          </li>
          <li
            className={`w-full ${pathname.split("/")[pathname.split("/").length - 1] === "tags" ? "-mb-0.5 border-b-2 border-b-black" : "text-gray-400"}`}
          >
            <LocalLink className="flex justify-center py-2" href="/discover/tags">
              {t("discover.tags")}
            </LocalLink>
          </li>
        </ul>
      </div>
      {children}
    </>
  );
}
