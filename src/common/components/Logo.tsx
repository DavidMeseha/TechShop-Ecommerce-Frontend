import React from "react";
import { LocalLink } from "./utils/LocalizedNavigation";
import { BiShoppingBag } from "react-icons/bi";
import { cn } from "@/common/lib/utils";

type Props = {
  className?: string;
};
export default function Logo({ className = "" }: Props) {
  return (
    <LocalLink aria-label="to Home Page" className={cn("flex items-center gap-2", className)} href="/">
      <BiShoppingBag size={40} />
      <span className="hidden text-2xl font-bold lg:inline">TechShop</span>
    </LocalLink>
  );
}
