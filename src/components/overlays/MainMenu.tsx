"use client";

import { LocalLink, useLocalPathname } from "@/components/util/LocalizedNavigation";
import React, { useMemo } from "react";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";
import DropdownButton from "../ui/DropdownButton";
import { changeLanguage } from "@/app/actions";
import { languages } from "@/lib/misc";
import { Language } from "@/types";
import { mobileMenu } from "@/constants/menus";
import { useProgress } from "@bprogress/next";

export default React.memo(function MainMenu() {
  const cartItems = useUserStore((state) => state.cartItems);
  const { pathname } = useLocalPathname();
  const { t, lang } = useTranslation();
  const { start, stop } = useProgress();

  const menu = useMemo(() => mobileMenu(t), [lang, cartItems.length]);
  const handleLanguageChange = async (value: string) => {
    if (value === lang) return;
    start();
    await changeLanguage(value as Language, pathname);
    stop();
  };

  return (
    <ul>
      {menu.map((item, index) => (
        <li key={index}>
          <LocalLink
            href={item.to}
            className={`hover:bg-lightGray mb-2 flex w-full items-center gap-2 rounded-md p-2 text-lg font-semibold ${
              pathname === item.to ? "text-primary" : ""
            }`}
          >
            {item.icon}
            {item.name}
          </LocalLink>
        </li>
      ))}
      <li className="p-2 md:hidden">
        <DropdownButton
          className="bg-transparent px-0"
          options={languages.map((lang) => ({ name: lang, value: lang }))}
          value={lang}
          onSelectItem={handleLanguageChange}
        >
          {lang.toUpperCase()}
        </DropdownButton>
      </li>
    </ul>
  );
});
