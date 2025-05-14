import { useUserStore } from "@/stores/userStore";
import { useTranslation } from "@/context/Translation";
import { LocalLink, useLocalPathname } from "@/components/util/LocalizedNavigation";
import React, { useMemo } from "react";
import { BsCompass, BsCompassFill, BsHouse, BsHouseFill } from "react-icons/bs";
import { RiProfileFill, RiProfileLine, RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";
import { PiInfinity } from "react-icons/pi";

export default React.memo(function BottomNav() {
  const { pathname } = useLocalPathname();
  const cartItems = useUserStore((state) => state.cartItems);
  const { t } = useTranslation();

  const bottomNav = useMemo(
    () => [
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
        to: "/user/me",
        icon: <RiProfileLine className="mx-auto" size={25} />,
        iconActive: <RiProfileFill className="mx-auto" size={25} />
      },
      {
        name: t("feeds"),
        to: "/feeds",
        icon: <PiInfinity className="mx-auto" size={20} />,
        iconActive: <PiInfinity className="mx-auto" size={20} />
      }
    ],
    []
  );

  return (
    <nav className="fixed bottom-0 end-0 start-0 z-20 block w-full border border-gray-300 bg-white md:hidden">
      <div className="flex w-full justify-between text-center font-bold">
        {bottomNav.map((item, index) => (
          <React.Fragment key={index}>
            <LocalLink className="block w-1/4 p-2" href={item.to} scroll={false}>
              <div className="relative inline-block">
                {pathname === item.to ? item.iconActive : item.icon}
                <div className="text-xs capitalize">{item.name}</div>
                {index === 2 && (
                  <div className="absolute -end-2 top-0 h-4 w-4 rounded-full bg-primary text-xs font-normal text-white">
                    {cartItems.length}
                  </div>
                )}
              </div>
            </LocalLink>
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
});
