import React from "react";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import RatingStars from "@/common/components/ui/extend/RatingStars";
import { useProductStore } from "@/common/stores/productStore";
import { IFullProduct } from "@/types";

type Props = Pick<IFullProduct, "productReviewOverview" | "name" | "price" | "vendor" | "_id" | "seName"> & {
  canAddReview: boolean;
};

export default function ProductCardBasicDetails(props: Props) {
  const setIsAddReviewOpen = useProductStore((state) => state.setIsAddReviewOpen);
  const rate = props.productReviewOverview.ratingSum / props.productReviewOverview.totalReviews;

  return (
    <div className="mt-2 flex flex-col gap-1 px-2 sm:px-4">
      <LocalLink className="font-semibold hover:underline" href={`/product/${props.seName}`}>
        <span title={props.name}>{props.name}</span>
      </LocalLink>

      {props.vendor.name ? (
        <p className="-mt-1 text-sm text-gray-600">
          sold by:{" "}
          <LocalLink className="underline hover:text-primary" href={`/vendor/${props.vendor.seName}`}>
            {props.vendor.name}
          </LocalLink>
        </p>
      ) : null}

      <span className="font-semibold">{props.price.price}$</span>

      <div className="flex items-center">
        <RatingStars rate={rate} size={15} />
        {props.canAddReview ? (
          <button
            aria-label="Add review"
            className="px-2 text-lg text-primary"
            onClick={() => setIsAddReviewOpen(true, props._id)}
          >
            <div className="lh-0 h-2">+</div>
          </button>
        ) : null}
      </div>
    </div>
  );
}
