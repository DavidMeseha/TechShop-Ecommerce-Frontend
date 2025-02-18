import { useAppStore } from "@/stores/appStore";
import { IFullProduct } from "@/types";
import React from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

export default function ViewMoreButton({ product }: { product: IFullProduct }) {
  const { setIsProductMoreInfoOpen } = useAppStore();
  return (
    <button
      aria-label="Open product more info"
      className="rounded-full bg-gray-200 fill-black p-2 text-center"
      onClick={() => setIsProductMoreInfoOpen(true, product._id)}
    >
      <PiDotsThreeOutlineVerticalFill className={`text-black transition-colors hover:fill-primary`} size="25" />
    </button>
  );
}
