import { BiArchive, BiListPlus } from "react-icons/bi";

export function headerVendorProfileMenu() {
  return [
    {
      name: "Your Products",
      to: "/admin/products",
      icon: <BiArchive size="20" />
    },
    {
      name: "Create Product",
      to: "/admin/create-product",
      icon: <BiListPlus size={20} />
    }
  ];
}
