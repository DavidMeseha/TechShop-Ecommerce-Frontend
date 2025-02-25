"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { BiMenu } from "react-icons/bi";
import { useTranslation } from "@/context/Translation";
import BackArrow from "@/components/ui/BackArrow";
import { useUserStore } from "@/stores/userStore";
import { useOverlayStore } from "@/stores/overlayStore";

type Props = {
  children: React.ReactNode;
  params: { seName: string };
};

export default function ProfileLayout(props: Props) {
  const params = props.params;

  const { children } = props;

  const setIsProfileMenuOpen = useOverlayStore((state) => state.setIsProfileMenuOpen);
  const user = useUserStore((state) => state.user);
  const { t, lang } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const titles: { [key: string]: string } = {
    "/profile/orders": t("profile.ordersHistory"),
    "/profile/me": t("profile"),
    "/profile/following": t("profile.following"),
    "/profile/changepassword": t("profile.changePassword"),
    "/profile/addresses": t("profile.addresses"),
    "/profile/cart": t("profile.cart"),
    "/profile/order-details": t("profile.orderDetails"),
    "/profile/reviews": t("profile.yourReviews")
  };

  let path = pathname.replace(`/${lang}`, "");
  path = params.seName ? path.replace(params.seName, "") : path;

  return (
    <>
      <div className="fixed end-0 start-0 top-0 z-20 w-full border bg-white px-2 md:hidden">
        <div className="flex justify-between py-2">
          <BackArrow onClick={() => router.back()} />
          <h1 className="text-lg font-bold">
            {pathname.includes("/profile/me")
              ? (user?.firstName || t("profile")) + " " + (user?.lastName || "")
              : pathname.includes("order-details")
                ? "Order Details"
                : titles[path]}
          </h1>
          {path === "/profile/me" ? (
            <button onClick={() => setIsProfileMenuOpen(true)}>
              <BiMenu size={25} />
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>
      </div>
      <div className="md:mt-0">{children}</div>
    </>
  );
}
