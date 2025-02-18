"use client";

import React from "react";
import VendorMenu from "../VendorMenu";
import { useAppStore } from "@/stores/appStore";
import { RiCloseLine } from "react-icons/ri";
import MainMenu from "../MainMenu";
import { useTranslation } from "@/context/Translation";
import { useUserStore } from "@/stores/userStore";

export default function HomeMenu() {
  const { isHomeMenuOpen, setIsHomeMenuOpen } = useAppStore();
  const { user } = useUserStore();
  const { t } = useTranslation();

  return (
    <div
      className={`fixed bottom-0 top-0 z-50 w-full bg-white p-4 transition-all duration-500 ease-in-out md:hidden ${isHomeMenuOpen ? "start-0" : "-start-full"}`}
      data-testid="main-menu"
    >
      <div className="relative">
        <div className="mb-6 text-2xl font-bold md:hidden">{t("mainMenu")}</div>
        <div
          className="absolute end-2 top-2 cursor-pointer rounded-full bg-lightGray p-1"
          data-testid="close-main-menu"
          onClick={() => setIsHomeMenuOpen(false)}
        >
          <RiCloseLine size={25} />
        </div>
        <MainMenu />
        {user?.isVendor ? <VendorMenu /> : null}
      </div>
    </div>
  );
}
