"use client";

import Button from "@/components/ui/Button";
import RatingStars from "@/components/ui/RatingStars";
import { IProductReview } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { getUserReviews } from "@/services/user.service";

export default function ReviewsPage() {
  const myReviewsQuery = useInfiniteQuery({
    queryKey: ["myReviews"],
    queryFn: ({ pageParam }) => getUserReviews({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const lastPage = myReviewsQuery.data?.pages.findLast((page) => page);

  return (
    <ul className="block px-4">
      {myReviewsQuery.isFetchedAfterMount ? (
        myReviewsQuery.data && myReviewsQuery.data.pages[0].data.length > 0 ? (
          <div>
            {myReviewsQuery.data.pages.map((page) =>
              page.data.map((review) => <ReviewItem key={review._id} review={review} />)
            )}
          </div>
        ) : (
          <div className="py-14 text-center text-gray-400">You Created No Reviews Yet</div>
        )
      ) : null}

      {!myReviewsQuery.isFetchedAfterMount ? (
        <div className="flex w-full flex-col items-center justify-center py-2">
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
      ) : lastPage && lastPage.pages.hasNext ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={myReviewsQuery.isFetchingNextPage}
            onClick={() => myReviewsQuery.fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      ) : null}
    </ul>
  );
}

function ReviewItem({ review }: { review: IProductReview }) {
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
