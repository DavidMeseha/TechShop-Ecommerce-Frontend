import RatingStars from "@/components/ui/RatingStars";
import { LocalLink } from "@/components/util/LocalizedNavigation";
import { IProductReview } from "@/types";

export default function ReviewItem({ review }: { review: IProductReview }) {
  return (
    <li className="border-b py-6">
      <div className="flex justify-between">
        <LocalLink className="mt-2 font-bold text-primary hover:underline" href={`/product/${review.product?.seName}`}>
          {review.product?.name}
        </LocalLink>
        <div>
          <RatingStars rate={review.rating} size={14} />
        </div>
      </div>
      <p className="mt-2">{review.reviewText}</p>
      {review.createdAt ? (
        <div className="flex justify-end text-xs text-gray-400">{new Date(review.createdAt).toLocaleString()}</div>
      ) : null}
    </li>
  );
}
