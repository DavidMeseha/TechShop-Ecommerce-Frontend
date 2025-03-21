import { IProductReview } from "@/types";
import Image from "next/image";
import React from "react";
import RatingStars from "./ui/RatingStars";
import { useTranslation } from "@/context/Translation";

type Props = {
  reviews: IProductReview[];
};

export default function Reviews({ reviews }: Props) {
  const { t } = useTranslation();
  return reviews.map((review) => {
    const customer = review.customer;
    return (
      <>
        <h2 className="p-4 text-2xl font-bold">{t("reviews")}</h2>
        <div className="mb-4 flex items-start gap-3" key={review._id}>
          <Image
            alt={customer?.firstName || "" + " " + customer?.lastName || ""}
            className="bg-lightGray h-10 w-10 rounded-full"
            height={50}
            src={customer?.imageUrl ?? "/images/placeholder-user.jpg"}
            width={50}
          />
          <div className="w-11/12 rounded-md bg-gray-200 p-2">
            <div className="flex items-center gap-3 text-sm font-bold">
              <span>{customer ? customer.firstName + " " + customer.lastName : "Deleted User"}</span>
              <RatingStars rate={review.rating} size={15} />
            </div>
            <p className="text-sm">{review.reviewText}</p>
            <p className="text-end text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </>
    );
  });
}
