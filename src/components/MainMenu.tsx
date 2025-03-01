"use client";

import { LocalLink, useLocalPathname } from "@/components/LocalizedNavigation";
import React, { useMemo } from "react";
import SubMenuItem from "./SubMenuItem";
import { RiProfileFill, RiProfileLine } from "react-icons/ri";
import { BsCompass, BsCompassFill, BsHouse, BsHouseFill } from "react-icons/bs";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import { PiInfinity, PiShoppingCart, PiShoppingCartFill } from "react-icons/pi";
import DropdownButton from "./DropdownButton";
import { changeLanguage } from "@/actions";
import { startProgress, stopProgress } from "next-nprogress-bar";
import { languages } from "@/lib/misc";
import { Language } from "@/types";

export default React.memo(function MainMenu() {
  const { t, lang } = useTranslation();
  const { pathname } = useLocalPathname();
  const cartItems = useUserStore((state) => state.cartItems);

  const menu = useMemo(
    () => [
      {
        id: 1,
        name: t("home"),
        to: "/",
        Icon: <BsHouse size={20} />,
        IconActive: <BsHouseFill size={20} />
      },
      {
        id: 2,
        name: t("feeds"),
        to: "/feeds",
        Icon: <PiInfinity size={20} />,
        IconActive: <PiInfinity size={20} />
      },
      {
        id: 3,
        name: t("profile"),
        to: `/profile/me`,
        Icon: <RiProfileLine size={20} />,
        IconActive: <RiProfileFill size={20} />
      },
      {
        id: 4,
        name: t("discover"),
        sup: [
          {
            name: t("categories"),
            to: `/discover/categories`
          },
          {
            name: t("vendors"),
            to: `/discover/vendors`
          },
          {
            name: t("tags"),
            to: `/discover/tags`
          }
        ],
        Icon: <BsCompass size={20} />,
        IconActive: <BsCompassFill size={20} />
      },
      {
        id: 5,
        name: t("cart") + ` (${cartItems.length})`,
        to: `/cart`,
        Icon: <PiShoppingCart size={20} />,
        IconActive: <PiShoppingCartFill size={20} />
      }
    ],
    [lang, cartItems.length]
  );

  return (
    <ul>
      {menu.map((item) => (
        <li key={item.id}>
          {item.to ? (
            <LocalLink
              href={item.to}
              className={`hover:bg-lightGray mb-2 flex w-full items-center gap-2 rounded-md p-2 text-lg font-semibold ${
                pathname === item.to ? "text-primary" : ""
              }`}
            >
              {pathname === item.to ? item.IconActive : item.Icon}
              {item.name}
            </LocalLink>
          ) : (
            item.sup && <SubMenuItem item={item} />
          )}
        </li>
      ))}
      <li className="p-2 md:hidden">
        <DropdownButton
          className="bg-transparent px-0"
          options={languages}
          value={lang}
          onSelectItem={async (value) => {
            if (value === lang) return;
            startProgress();
            await changeLanguage(value as Language, pathname);
            stopProgress();
          }}
        >
          {lang.toUpperCase()}
        </DropdownButton>
      </li>
    </ul>
  );
});
