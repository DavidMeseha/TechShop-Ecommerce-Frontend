import { IProductReview } from "@/types";
import React from "react";
import Image from "next/image";
import RatingStars from "../ui/RatingStars";
import { BiLoaderCircle } from "react-icons/bi";

export default function Reviews({ reviews, isLoading }: { reviews?: IProductReview[]; isLoading: boolean }) {
  return (
    <>
      <div className="w-full bg-[#F8F8F8] p-4 pb-28">
        {reviews?.map((review) => (
          <div className="mb-4 flex items-start gap-3" key={review._id}>
            <Image
              alt={review.customer.firstName + " " + review.customer.lastName}
              className="bg-lightGray h-10 w-10 rounded-full"
              height={50}
              src={review.customer.imageUrl}
              width={50}
            />
            <div className="bg-lightGray w-11/12 rounded-md p-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold">{review.customer.firstName + " " + review.customer.lastName}</div>
                <RatingStars rate={review.rating} size={14} />
              </div>
              <p className="text-sm">{review.reviewText}</p>
            </div>
          </div>
        ))}
        {isLoading ? (
          <div>
            <BiLoaderCircle className="animate-spin fill-inherit" size={20} />
          </div>
        ) : null}
      </div>
    </>
  );
}
