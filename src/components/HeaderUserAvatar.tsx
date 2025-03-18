import { useTranslation } from "@/context/Translation";
import { useUserSetup } from "@/context/UserProvider";
import { headerProfileMenu } from "@/schemas/menus";
import { User } from "@/types";
import { useRouter } from "@bprogress/next";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { FiLogOut } from "react-icons/fi";

type Props = {
  user: User;
};

export default function HeaderUserAvatar({ user }: Props) {
  const { logout } = useUserSetup();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const router = useRouter();
  const { t, lang } = useTranslation();
  const menu = useMemo(() => headerProfileMenu(t), [lang]);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
  };

  return (
    <div className="me-4 flex items-center">
      <div className="relative">
        <button
          className="mt-1 rounded-full border border-primary-300 outline outline-0 outline-primary-300 transition-[outline] hover:outline hover:outline-4"
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
          <ul className="absolute end-0 top-12 w-[200px] rounded-lg border bg-white shadow-xl">
            {menu.map((item, index) => (
              <li className="block hover:bg-gray-100" key={index}>
                <button
                  className="flex w-full gap-1 px-2 py-3"
                  onClick={() => {
                    router.push(item.to);
                    setShowMenu(false);
                  }}
                >
                  {item.icon}
                  <span className="text-sm font-semibold">{item.name}</span>
                </button>
              </li>
            ))}
            <li className="block hover:bg-gray-100">
              <a className="flex w-full gap-1 border-t px-2 py-3" onClick={handleLogout}>
                <FiLogOut size={20} />
                <span className="text-sm font-semibold">{t("logout")}</span>
              </a>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}
