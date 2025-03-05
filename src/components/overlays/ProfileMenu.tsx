"use client";

import React, { useState } from "react";
import OverlayLayout from "./OverlayLayout";
import { LocalLink } from "@/components/LocalizedNavigation";
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "@/context/Translation";
import { FaRegAddressBook } from "react-icons/fa";
import { BsStar } from "react-icons/bs";
import { PiPassword } from "react-icons/pi";
import { useOverlayStore } from "@/stores/overlayStore";
import { useUserSetup } from "@/context/UserProvider";

export default function ProfileMenuOverlay() {
  const setIsProfileMenuOpen = useOverlayStore((state) => state.setIsProfileMenuOpen);
  const { logout } = useUserSetup();
  const { t } = useTranslation();
  const [activeTap, setActiveTap] = useState("main");

  const userMenuNav = [
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
              <button className="flex items-center gap-4 py-2 font-semibold" onClick={logout}>
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
