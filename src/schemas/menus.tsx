import { TFunction } from "@/types";
import { BiHistory, BiUser } from "react-icons/bi";
import { BsStar } from "react-icons/bs";
import { FaRegAddressBook, FaSalesforce } from "react-icons/fa";
import { PiPassword } from "react-icons/pi";

export function headerProfileMenu(t: TFunction) {
  return [
    {
      name: t("profile"),
      to: "/user/me",
      icon: <BiUser size="20" />
    },
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
      name: t("profile.ordersHistory"),
      to: "/user/reviews",
      icon: <BiHistory size={20} />
    }
  ];
}

export function mobileMenu(t: TFunction) {
  return [
    {
      name: t("profile"),
      to: "/user/me",
      icon: <BiUser size="20" />
    },
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
      name: t("profile.ordersHistory"),
      to: "/user/reviews",
      icon: <BiHistory size={20} />
    },
    {
      name: t("profile.changePassword"),
      to: "/user/changepassword",
      icon: <PiPassword size={20} />
    },
    {
      name: t("profile.following"),
      to: "/user/following",
      icon: <FaSalesforce size="20" />
    }
  ];
}
