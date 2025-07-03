"use client";

import React from "react";
import { IFullProduct } from "@/types";
import { BsStarFill } from "react-icons/bs";
import { useUserStore } from "@/common/stores/userStore";
import { toast } from "react-toastify";
import { useProductStore } from "@/common/stores/productStore";

type Props = {
  product: IFullProduct;
  isRated: boolean;
};

export default React.memo(function RateProductButton({ product, isRated }: Props) {
  const user = useUserStore((state) => state.user);
  const setIsAddReviewOpen = useProductStore((state) => state.setIsAddReviewOpen);

  const handleAddreviewClick = () => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn("You need to login to berform action");
    if (!isRated) setIsAddReviewOpen(true, product._id);
  };

  return (
    <div className="fill-black text-center">
      <button
        aria-label="Open Review Form"
        className="block rounded-full bg-gray-200 p-2"
        onClick={handleAddreviewClick}
      >
        <BsStarFill
          className={`transition-all ${isRated ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
          size="25"
        />
      </button>
      <span className="text-blend text-sm font-semibold">
        {product.productReviewOverview.totalReviews
          ? (product.productReviewOverview.ratingSum / product.productReviewOverview.totalReviews).toFixed(1)
          : 0 || 0}
      </span>
    </div>
  );
});
