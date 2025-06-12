"use client";

import { LocalLink, useLocalPathname } from "@/components/util/LocalizedNavigation";
import { useTranslation } from "@/context/Translation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { pathname } = useLocalPathname();
  const { t } = useTranslation();

  return (
    <>
      {pathname === "/user/addresses" && (
        <div className="hidden justify-end p-4 md:flex">
          <LocalLink className="rounded-md bg-primary px-4 py-2 text-white" href="/user/addresses/add">
            {t("addresses.newAddress")} +
          </LocalLink>
        </div>
      )}
      <div className="sticky top-11 z-20 bg-white md:hidden">
        <ul className="z-10 flex items-center border-b bg-white">
          {pathname === "/user/addresses" ? (
            <li className={`w-full ${pathname.includes("/addresses/edit") && "-mb-0.5 border-b-2 border-b-black"}`}>
              <LocalLink className="flex cursor-pointer justify-center py-2" href="/user/addresses/edit">
                {t("addresses.editAddress")}
              </LocalLink>
            </li>
          ) : null}
          <li className={`w-full ${pathname.includes("/addresses/add") && "-mb-0.5 border-b-2 border-b-black"}`}>
            <LocalLink className="flex cursor-pointer justify-center py-2" href="/user/addresses/add">
              {t("addresses.newAddress")}
            </LocalLink>
          </li>
          <li className={`w-full ${pathname === "/user/addresses" && "-mb-0.5 border-b-2 border-b-black"}`}>
            <LocalLink className="flex cursor-pointer justify-center py-2" href="/user/addresses">
              {t("profile.addresses")}
            </LocalLink>
          </li>
        </ul>
      </div>
      <div className="p-2 pb-6">{children}</div>
    </>
  );
}
