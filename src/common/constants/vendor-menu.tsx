import { TFunction } from "@/types";
import { BiArchive, BiListPlus } from "react-icons/bi";

export function vendorMenu(t: TFunction) {
  return [
    {
      name: t("menu.yourProducts"),
      to: "/admin/products",
      icon: <BiArchive size="20" />
    },
    {
      name: t("menu.createProduct"),
      to: "/admin/create-product",
      icon: <BiListPlus size={20} />
    }
  ];
}
