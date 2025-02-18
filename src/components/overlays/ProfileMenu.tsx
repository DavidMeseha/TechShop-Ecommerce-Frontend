"use client";

import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { useAppStore } from "@/stores/appStore";
import { LocalLink } from "@/components/LocalizedNavigation";
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "@/context/Translation";
import { FaRegAddressBook } from "react-icons/fa";
import { BsStar } from "react-icons/bs";
import { PiPassword } from "react-icons/pi";
import { logout } from "@/actions";
import { usePathname } from "next/navigation";

export default function ProfileMenuOverlay() {
  const pathname = usePathname();
  const { setIsProfileMenuOpen } = useAppStore();
  const [activeTap, setActiveTap] = useState("main");
  const { t } = useTranslation();

  const userMenuNav = [
    {
      name: t("profile.addresses"),
      to: "/profile/addresses",
      icon: <FaRegAddressBook size={20} />
    },
    {
      name: t("profile.myReviews"),
      to: "/profile/reviews",
      icon: <BsStar size={20} />
    },
    {
      name: t("profile.changePassword"),
      to: "/profile/changepassword",
      icon: <PiPassword size={20} />
    }
  ];

  return (
    <OverlayLayout close={() => setIsProfileMenuOpen(false)} title={t("profile")}>
      <>
        {activeTap === "main" && (
          <ul>
            {userMenuNav.map((item, index) => (
              <li key={index}>
                {item.to ? (
                  <LocalLink className="flex items-center gap-4 py-2 font-semibold" href={item.to}>
                    {item.icon}
                    {item.name}
                  </LocalLink>
                ) : (
                  <button
                    className="flex items-center gap-4 py-2 font-semibold"
                    onClick={() => setActiveTap(item.name)}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                )}
              </li>
            ))}
            <li>
              <button className="flex items-center gap-4 py-2 font-semibold" onClick={() => logout(pathname)}>
                <FiLogOut size={20} />
                {t("logout")}
              </button>
            </li>
          </ul>
        )}
      </>
    </OverlayLayout>
  );
}
