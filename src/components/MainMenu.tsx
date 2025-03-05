"use client";

import { LocalLink, useLocalPathname } from "@/components/LocalizedNavigation";
import React, { useMemo } from "react";
import SubMenuItem from "./SubMenuItem";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import DropdownButton from "./DropdownButton";
import { changeLanguage } from "@/actions";
import { startProgress, stopProgress } from "next-nprogress-bar";
import { languages } from "@/lib/misc";
import { Language } from "@/types";
import mainNavItems from "@/schemas/mainNavItems";

export default React.memo(function MainMenu() {
  const { t, lang } = useTranslation();
  const { pathname } = useLocalPathname();
  const cartItems = useUserStore((state) => state.cartItems);

  const menu = useMemo(() => mainNavItems(t, cartItems.length), [lang, cartItems.length]);

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
              {pathname === item.to ? item.iconActive : item.icon}
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
