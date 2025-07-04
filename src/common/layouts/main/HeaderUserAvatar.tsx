import { useTranslation } from "@/common/context/Translation";
import { useUserSetup } from "@/common/context/User";
import { headerProfileMenu } from "@/common/constants/main-menu";
import { IUser } from "@/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { vendorMenu } from "@/common/constants/vendor-menu";
import { Separator } from "@/common/components/ui/separator";
import { BiRegistered } from "react-icons/bi";

type Props = {
  user: IUser;
};

export default function HeaderUserAvatar({ user }: Props) {
  const { logout } = useUserSetup();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { t, lang } = useTranslation();
  const menu = useMemo(() => headerProfileMenu(t), [lang]);
  const vendorMenuItems = useMemo(() => vendorMenu(t), [lang]);

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
          <ul className="absolute end-0 top-12 w-[200px] overflow-clip rounded-lg border bg-white shadow-xl">
            {menu.map((item, index) => (
              <LocalLink
                className="flex w-full gap-1 px-2 py-3 hover:bg-gray-100"
                href={item.to as any}
                key={index}
                onClick={() => setShowMenu(false)}
              >
                {item.icon}
                <span className="text-sm font-semibold">{item.name}</span>
              </LocalLink>
            ))}
            {user.isVendor ? (
              <>
                <Separator />
                {vendorMenuItems.map((item, index) => (
                  <LocalLink
                    className="flex w-full gap-1 px-2 py-3 hover:bg-gray-100"
                    href={item.to as any}
                    key={index}
                    onClick={() => setShowMenu(false)}
                  >
                    {item.icon}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </LocalLink>
                ))}
              </>
            ) : (
              <>
                <Separator />
                <LocalLink
                  className="flex w-full gap-1 px-2 py-3 text-primary hover:bg-primary/10"
                  href={"/admin/register"}
                  onClick={() => setShowMenu(false)}
                >
                  <BiRegistered size={20} />
                  <span className="text-sm font-semibold">Register Vendor</span>
                </LocalLink>
              </>
            )}
            <li className="block text-destructive hover:bg-destructive/10">
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
