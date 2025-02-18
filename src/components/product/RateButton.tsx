"use client";

import React from "react";
import { IFullProduct } from "@/types";
import { useAppStore } from "@/stores/appStore";
import { BsStarFill } from "react-icons/bs";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";

type Props = {
  product: IFullProduct;
};

export default function RateProductButton({ product }: Props) {
  const { reviews, user } = useUserStore();
  const { setIsAddReviewOpen } = useAppStore();
  const isReviewed = reviews.includes(product._id);

  const handleAddreviewClick = () => {
    if (!user) return;
    if (!user.isRegistered) return toast.warn("You need to login to berform action");
    if (!isReviewed) setIsAddReviewOpen(true, product._id);
  };

  return (
    <button aria-label="Open Review Form" className="fill-black text-center" onClick={handleAddreviewClick}>
      <div className="rounded-full bg-gray-200 p-2">
        <BsStarFill
          className={`transition-all ${isReviewed ? "fill-primary" : "fill-black"} text-black hover:fill-primary`}
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
