import { useLocalPathname } from "@/common/components/utils/LocalizedNavigation";
import { useTranslation } from "@/common/context/Translation";
import { useOverlayStore } from "@/common/stores/overlayStore";
import React from "react";
import { BiMenu } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { Button } from "@/common/components/ui/button";

export default function TopMobileNav() {
  const setIsHomeMenuOpen = useOverlayStore((state) => state.setIsHomeMenuOpen);
  const setIsSearchOpen = useOverlayStore((state) => state.setIsSearchOpen);
  const { t } = useTranslation();
  const pathname = useLocalPathname();

  let path = pathname.pathname;

  const titles: { [key: string]: string } = {
    "/user/orders": t("profile.ordersHistory"),
    "/user/me": t("profile"),
    "/user/following": t("profile.following"),
    "/user/changepassword": t("profile.changePassword"),
    "/user/addresses": t("profile.addresses"),
    "/user/cart": t("profile.cart"),
    "/user/order-details": t("profile.orderDetails"),
    "/user/reviews": t("profile.yourReviews"),
    "/user/checkout": t("checkout"),
    "/user/order-success": t("checkout.orderPlacedSuccessfully"),
    "/cart": t("cart"),
    "/discover/categories": t("discover"),
    "/discover/tags": t("discover"),
    "/discover/vendors": t("discover"),
    "/": t("home")
  };

  return (
    <nav className="sticky top-0 z-40 flex w-full justify-between border-b bg-white p-2 px-4 md:hidden">
      <Button
        aria-label="Open Main Menu"
        className="bg-transparent p-0 hover:bg-transparent"
        onClick={() => setIsHomeMenuOpen(true)}
      >
        <BiMenu className="fill-black" size={25} />
      </Button>
      <h1 className="text-xl font-bold">{titles[path]}</h1>
      <Button
        aria-label="Open Search Page"
        className="bg-transparent p-0 hover:bg-transparent"
        onClick={() => setIsSearchOpen(true)}
      >
        <BsSearch className="fill-black" size={20} />
      </Button>
    </nav>
  );
}
