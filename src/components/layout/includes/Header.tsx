"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import { BiSearch, BiShoppingBag, BiUser } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useTranslation } from "../../../context/Translation";
import Image from "next/image";
import { useRouter, startProgress, stopProgress } from "next-nprogress-bar";
import DropdownButton from "@/components/DropdownButton";
import { changeLanguage, logout } from "@/actions";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Language } from "@/types";
import { languages } from "@/lib/misc";
import Skeleton from "react-loading-skeleton";
import { useOverlayStore } from "@/stores/overlayStore";

export default function Header() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { t, lang } = useTranslation();
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);

  const goTo = () => {
    if (!user || !user.isRegistered) return router.push(`/${lang}/login`);
    router.push(`/${lang}/upload`);
  };

  return (
    <header className="fixed z-30 hidden h-[60px] w-screen items-center border-b bg-white md:flex" id="TopNav">
      <div className={`mx-auto flex w-full items-center justify-between gap-6 pe-8 ps-4`}>
        <LocalLink aria-label="to Home Page" className="flex items-center gap-2" href="/">
          {/* <Image
            alt="Tiktok"
            className="h-auto min-w-[115px] object-cover"
            height={115}
            priority
            src="/images/tiktok-logo.png"
            width={115}
          /> */}
          <BiShoppingBag size={40} />
          <span className="text-2xl font-bold">TechShop</span>
        </LocalLink>

        {user ? (
          <div className="flex items-center gap-3">
            {user?.isVendor && (
              <Button className="rounded-sm border hover:bg-gray-100" onClick={() => goTo()}>
                <div className="flex items-center">
                  <AiOutlinePlus color="#000000" size="22" />
                  <span className="px-2 text-[15px] font-medium">{t("upload")}</span>
                </div>
              </Button>
            )}

            <Button
              aria-label="Open Search"
              className="me-2 border-e pe-4 text-black"
              onClick={() => setIsSearchOpen(true)}
            >
              <BiSearch size={25} />
            </Button>

            <DropdownButton
              className="w-fit bg-transparent px-0"
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

            {!user || !user.isRegistered ? (
              <LocalLink className="rounded-sm bg-primary px-4 py-2 text-white" href="/login">
                <span className="mx-4 whitespace-nowrap text-[15px] font-medium">{t("login")}</span>
              </LocalLink>
            ) : (
              <div className="me-4 flex items-center">
                <div className="relative">
                  <button
                    className="mt-1 rounded-full border border-primary-300"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <Image
                      alt={user.firstName || ""}
                      className="h-[35px] w-[35px] rounded-full"
                      height={45}
                      src={user.imageUrl}
                      width={45}
                    />
                  </button>

                  {showMenu ? (
                    <div className="absolute end-0 top-12 w-[200px] rounded-lg border bg-white shadow-xl">
                      <button
                        className="flex w-full gap-1 px-2 py-3 hover:bg-gray-100"
                        onClick={() => {
                          router.push(`/${lang}/profile/me`);
                          setShowMenu(false);
                        }}
                      >
                        <BiUser size="20" />
                        <span className="text-sm font-semibold">{t("menu.profile")}</span>
                      </button>
                      <button
                        className="flex w-full gap-1 border-t px-2 py-3 hover:bg-gray-100"
                        onClick={() => {
                          logout(pathname);
                          setShowMenu(false);
                        }}
                      >
                        <FiLogOut size={20} />
                        <span className="text-sm font-semibold">{t("logout")}</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Skeleton baseColor="#d5d5d5" height={41} highlightColor="#ececec" width={180} />
        )}
      </div>
    </header>
  );
}
