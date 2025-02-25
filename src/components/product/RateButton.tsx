"use client";

import React from "react";
import { IFullProduct } from "@/types";
import { BsStarFill } from "react-icons/bs";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";
import { useProductStore } from "@/stores/productStore";

type Props = {
  product: IFullProduct;
  isRated: boolean;
};

export default function RateProductButton({ product, isRated }: Props) {
  const user = useUserStore((state) => state.user);
  const setIsAddReviewOpen = useProductStore((state) => state.setIsAddReviewOpen);

  const handleAddreviewClick = () => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn("You need to login to berform action");
    if (!isRated) setIsAddReviewOpen(true, product._id);
  };

  return (
    <button aria-label="Open Review Form" className="fill-black text-center" onClick={handleAddreviewClick}>
      <div className="rounded-full bg-gray-200 p-2">
        <BsStarFill
          className={`transition-all ${isRated ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </div>
      <span className="text-blend text-sm font-semibold">
        {product.productReviewOverview.totalReviews
          ? (product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews).toFixed(1)
          : 0 || 0}
      </span>
    </button>
  );
}
