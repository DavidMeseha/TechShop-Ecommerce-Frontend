import { BsCompass, BsCompassFill, BsHouse, BsHouseFill } from "react-icons/bs";
import { TFunction } from "../types";
import { PiInfinity, PiShoppingCart, PiShoppingCartFill } from "react-icons/pi";
import { RiProfileFill, RiProfileLine } from "react-icons/ri";

const mainNavItems = (t: TFunction, cartItemsCount: number) => [
  {
    id: 1,
    name: t("home"),
    to: "/",
    icon: <BsHouse size={20} />,
    iconActive: <BsHouseFill size={20} />
  },
  {
    id: 2,
    name: t("feeds"),
    to: "/feeds",
    icon: <PiInfinity size={20} />,
    iconActive: <PiInfinity size={20} />
  },
  {
    id: 3,
    name: t("profile"),
    to: `/user/me`,
    icon: <RiProfileLine size={20} />,
    iconActive: <RiProfileFill size={20} />
  },
  {
    id: 4,
    name: t("discover"),
    sub: [
      {
        name: t("categories"),
        to: `/discover/categories`
      },
      {
        name: t("vendors"),
        to: `/discover/vendors`
      },
      {
        name: t("tags"),
        to: `/discover/tags`
      }
    ],
    icon: <BsCompass size={20} />,
    iconActive: <BsCompassFill size={20} />
  },
  {
    id: 5,
    name: t("cart") + ` (${cartItemsCount})`,
    to: `/cart`,
    icon: <PiShoppingCart size={20} />,
    iconActive: <PiShoppingCartFill size={20} />
  }
];

export default mainNavItems;
