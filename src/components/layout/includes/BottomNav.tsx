import { useUserStore } from "@/stores/userStore";
import { useTranslation } from "@/context/Translation";
import { useUser } from "@/context/user";
import { LocalLink, useLocalPathname } from "@/components/LocalizedNavigation";
import React from "react";
import { BsCompass, BsCompassFill, BsHouse, BsHouseFill } from "react-icons/bs";
import { RiProfileFill, RiProfileLine, RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";

export default function BottomNav() {
  const { user } = useUser();
  const { pathname } = useLocalPathname();
  const { cartProducts } = useUserStore();
  const { t } = useTranslation();

  const bottomNav = [
    {
      name: t("home"),
      to: "/",
      icon: <BsHouse className="mx-auto" size={25} />,
      iconActive: <BsHouseFill className="mx-auto" size={25} />
    },
    {
      name: t("discover"),
      to: "/discover/vendors",
      icon: <BsCompass className="mx-auto" size={25} />,
      iconActive: <BsCompassFill className="mx-auto" size={25} />
    },
    {
      name: t("cart"),
      to: "/cart",
      icon: <RiShoppingCartLine className="mx-auto" size={25} />,
      iconActive: <RiShoppingCartFill className="mx-auto" size={25} />
    },
    {
      name: t("profile"),
      to: "/profile/me",
      icon: <RiProfileLine className="mx-auto" size={25} />,
      iconActive: <RiProfileFill className="mx-auto" size={25} />
    }
  ];

  if (!user) return;

  return (
    <div className="fixed bottom-0 end-0 start-0 z-20 block w-full border border-gray-300 bg-white md:hidden">
      <div className="m-auto flex w-11/12 justify-between text-center font-bold">
        {bottomNav.map((item, index) => (
          <React.Fragment key={index}>
            <LocalLink className="block w-1/4 p-2" href={item.to} scroll={false}>
              <div className="relative inline-block">
                {pathname === item.to ? item.iconActive : item.icon}
                <div className="text-xs capitalize">{item.name}</div>
                {index === 2 && (
                  <div className="absolute -end-2 top-0 h-4 w-4 rounded-full bg-primary text-xs font-normal text-white">
                    {cartProducts.length}
                  </div>
                )}
              </div>
            </LocalLink>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
