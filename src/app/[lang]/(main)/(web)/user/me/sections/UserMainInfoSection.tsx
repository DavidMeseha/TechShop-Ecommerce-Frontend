"use client";

import { INFO_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import { getUserInfo } from "@/web/services/user.service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { useOverlayStore } from "@/common/stores/overlayStore";
import { useTranslation } from "@/common/context/Translation";
import { FiSettings } from "react-icons/fi";
import { BiPencil } from "react-icons/bi";
import { UserActivity } from "../components/UserActivity";

export default function UserMainInfoSection() {
  const isEditProfileOpen = useOverlayStore((state) => state.isEditProfileOpen);
  const setIsEditProfileOpen = useOverlayStore((state) => state.setIsEditProfileOpen);
  const setIsProfileMenuOpen = useOverlayStore((state) => state.setIsProfileMenuOpen);
  const { t } = useTranslation();

  const userInfoQuery = useQuery({
    queryKey: [USER_QUERY_KEY, INFO_QUERY_KEY],
    queryFn: () => getUserInfo()
  });
  const userInfo = userInfoQuery.data;

  if (!userInfo) return;

  const activities = [
    {
      name: t("profile.following"),
      value: 0, //TODO: Need to get this from the server
      to: `/user/following`
    },
    {
      name: t("profile.orders"),
      value: userInfo.ordersCount,
      to: `/user/orders`
    }
  ];

  return (
    <div className="flex w-full flex-col items-center md:mt-0">
      <Image
        alt={userInfo.firstName + " " + userInfo.lastName}
        className="h-[120px] w-[120px] rounded-full object-cover"
        height={120}
        priority={true}
        quality={85}
        src={userInfo.imageUrl}
        width={120}
      />
      <p className="text-center text-[30px] font-bold">
        {userInfo.firstName + " " + userInfo.lastName}
        <span>
          <button
            className="bg-lightGray ms-2 rounded-md p-1 text-xs font-semibold"
            onClick={() => setIsProfileMenuOpen(true)}
          >
            <FiSettings size={16} />
          </button>
        </span>
        <span>
          <button
            className="bg-lightGray ms-2 rounded-md p-1 text-xs font-semibold md:inline-block"
            onClick={() => setIsEditProfileOpen(!isEditProfileOpen)}
          >
            <BiPencil size={16} />
          </button>
        </span>
      </p>

      <UserActivity activities={activities} />
    </div>
  );
}
