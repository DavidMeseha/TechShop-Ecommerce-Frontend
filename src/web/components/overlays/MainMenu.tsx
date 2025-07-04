"use client";

import { AppRoutes, LocalLink, useLocalPathname } from "@/common/components/utils/LocalizedNavigation";
import React, { Fragment, useMemo } from "react";
import { useTranslation } from "@/common/context/Translation";
import { useUserStore } from "@/common/stores/userStore";
import DropdownButton from "@/common/components/ui/extend/DropdownButton";
import { changeLanguage } from "@/app/actions";
import { languages } from "@/common/lib/utils";
import { Language } from "@/types";
import { mobileMenu } from "@/common/constants/main-menu";
import { useProgress } from "@bprogress/next";
import { vendorMenu } from "@/common/constants/vendor-menu";
import { LogIn } from "lucide-react";
import { RiRegisteredLine } from "react-icons/ri";

export default React.memo(function MainMenu() {
  const cartItems = useUserStore((state) => state.cartItems);
  const user = useUserStore((state) => state.user);
  const { pathname } = useLocalPathname();
  const { t, lang } = useTranslation();
  const { start, stop } = useProgress();

  const menu = useMemo(() => {
    if (user?.isRegistered && !user.isVendor)
      return [
        ...mobileMenu(t),
        { name: t("admin.registerVendor"), icon: <RiRegisteredLine size={18} />, to: "/admin/register" }
      ];
    if (user?.isRegistered && user.isVendor) return [...mobileMenu(t), ...vendorMenu(t)];
    return [{ name: t("login"), icon: <LogIn size={18} />, to: "/login" }];
  }, [lang, cartItems.length, user?.isVendor]);

  const handleLanguageChange = async (value: string) => {
    if (value === lang) return;
    start();
    await changeLanguage(value as Language, pathname);
    stop();
  };

  return (
    <ul>
      {menu.map((item, index) => (
        <Fragment key={index}>
          <li>
            <LocalLink
              href={item.to as AppRoutes}
              className={`hover:bg-lightGray mb-2 flex w-full items-center gap-2 rounded-md p-2 text-lg font-semibold ${
                pathname === item.to ? "text-primary" : ""
              }`}
            >
              {item.icon}
              {item.name}
            </LocalLink>
          </li>
        </Fragment>
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
