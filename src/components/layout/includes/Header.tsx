"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import { BiSearch, BiShoppingBag } from "react-icons/bi";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/context/Translation";
import DropdownButton from "@/components/DropdownButton";
import { changeLanguage } from "@/actions";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Language } from "@/types";
import { languages } from "@/lib/misc";
import Skeleton from "react-loading-skeleton";
import { useOverlayStore } from "@/stores/overlayStore";
import HeaderUserAvatar from "../../HeaderUserAvatar";
import HeaderNav from "@/components/HeaderNav";
import { useProgress } from "@bprogress/next";

export default function Header() {
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();
  const { t, lang } = useTranslation();
  const { start, stop } = useProgress();

  const handleLanguageChange = async (value: string) => {
    if (value === lang) return;
    start();
    await changeLanguage(value as Language, pathname);
    stop();
  };

  return (
    <header className="sticky top-0 z-40 hidden h-[60px] w-screen items-center border-b bg-white md:flex" id="TopNav">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-6 pe-8 ps-4">
        <LocalLink aria-label="to Home Page" className="flex items-center gap-2" href="/">
          <BiShoppingBag size={40} />
          <span className="hidden text-2xl font-bold lg:inline">TechShop</span>
        </LocalLink>

        <HeaderNav />

        <div className="flex w-64 items-center justify-end gap-3">
          <Button
            aria-label="Open Search"
            className="me-2 border-e pe-4 text-black"
            onClick={() => setIsSearchOpen(true)}
          >
            <BiSearch size={25} />
          </Button>

          <DropdownButton
            className="w-fit bg-transparent px-0"
            options={languages.map((lang) => ({ name: lang, value: lang }))}
            onSelectItem={handleLanguageChange}
          >
            {lang.toUpperCase()}
          </DropdownButton>

          {user ? (
            !user || !user.isRegistered ? (
              <Button className="rounded-sm bg-primary px-4 py-2 text-white" onClick={() => setIsLoginOpen(true)}>
                <span className="mx-4 whitespace-nowrap text-[15px] font-medium">{t("login")}</span>
              </Button>
            ) : (
              <HeaderUserAvatar user={user} />
            )
          ) : (
            <Skeleton baseColor="#d5d5d5" height={41} highlightColor="#ececec" width={110} />
          )}
        </div>
      </div>
    </header>
  );
}
