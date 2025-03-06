import { IProductReview } from "@/types";
import Image from "next/image";
import React from "react";

type Props = {
  reviews: IProductReview[];
};

export default function Reviews({ reviews }: Props) {
  return reviews.map((review) => {
    const customer = review.customer;
    return (
      <div className="mb-4 flex items-start gap-3" key={review._id}>
        <Image
          alt={customer?.firstName || "" + " " + customer?.lastName || ""}
          className="bg-lightGray h-10 w-10 rounded-full"
          height={50}
          src={customer?.imageUrl ?? "/images/placeholder-user.jpg"}
          width={50}
        />
        <div className="w-11/12 rounded-md bg-gray-200 p-2">
          <div className="text-sm font-bold">
            {customer ? customer.firstName + " " + customer.lastName : "Deleted User"}
          </div>
          <p className="text-sm">{review.reviewText}</p>
        </div>
      </div>
    );
  });
}
