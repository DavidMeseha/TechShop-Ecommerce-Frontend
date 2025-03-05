import { useTranslation } from "@/context/Translation";
import { useUserSetup } from "@/context/UserProvider";
import { User } from "@/types";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import React, { useState } from "react";
import { BiUser } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";

type Props = {
  user: User;
};

export default function HeaderUserAvatar({ user }: Props) {
  const { logout } = useUserSetup();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const router = useRouter();
  const { t, lang } = useTranslation();

  return (
    <div className="me-4 flex items-center">
      <div className="relative">
        <button className="mt-1 rounded-full border border-primary-300" onClick={() => setShowMenu(!showMenu)}>
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
                router.push(`/${lang}/user/me`);
                setShowMenu(false);
              }}
            >
              <BiUser size="20" />
              <span className="text-sm font-semibold">{t("menu.profile")}</span>
            </button>
            <button
              className="flex w-full gap-1 border-t px-2 py-3 hover:bg-gray-100"
              onClick={() => {
                logout();
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
  );
}
