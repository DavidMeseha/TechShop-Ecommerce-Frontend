"use client";

import React, { useMemo } from "react";
import OverlayLayout from "@/common/layouts/OverlayLayout";
import { AppRoutes, LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "@/common/context/Translation";
import { FaRegAddressBook } from "react-icons/fa";
import { BsStar } from "react-icons/bs";
import { PiPassword } from "react-icons/pi";
import { useOverlayStore } from "@/web/stores/overlayStore";
import { useUserSetup } from "@/common/context/User";

export default function ProfileMenuOverlay() {
  const setIsProfileMenuOpen = useOverlayStore((state) => state.setIsProfileMenuOpen);
  const { logout } = useUserSetup();
  const { t, lang } = useTranslation();

  const userMenuNav = useMemo(
    () => [
      {
        name: t("profile.addresses"),
        to: "/user/addresses",
        icon: <FaRegAddressBook size={20} />
      },
      {
        name: t("profile.myReviews"),
        to: "/user/reviews",
        icon: <BsStar size={20} />
      },
      {
        name: t("profile.changePassword"),
        to: "/user/changepassword",
        icon: <PiPassword size={20} />
      }
    ],
    [lang]
  );

  return (
    <OverlayLayout close={() => setIsProfileMenuOpen(false)} title={t("profile")}>
      <ul>
        {userMenuNav.map((item, index) => (
          <li key={index}>
            <LocalLink className="flex items-center gap-4 py-2 font-semibold" href={item.to as AppRoutes}>
              {item.icon}
              {item.name}
            </LocalLink>
          </li>
        ))}
        <li>
          <button className="flex items-center gap-4 py-2 font-semibold" onClick={logout}>
            <FiLogOut size={20} />
            {t("logout")}
          </button>
        </li>
      </ul>
    </OverlayLayout>
  );
}
