"use client";

import Button from "@/components/ui/Button";
import RatingStars from "@/components/ui/RatingStars";
import { IProductReview } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { getUserReviews } from "@/services/user.service";
import { useTranslation } from "@/context/Translation";

export default function ReviewsPage() {
  const { t } = useTranslation();

  const { hasNextPage, fetchNextPage, data, isFetchedAfterMount, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["myReviews"],
    queryFn: ({ pageParam }) => getUserReviews({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined)
  });
  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <ul className="block px-4">
      {isFetchedAfterMount ? (
        reviews.length > 0 ? (
          reviews.map((review) => <ReviewItem key={review._id} review={review} />)
        ) : (
          <div className="py-14 text-center text-gray-400">{t("profile.noReviews")}</div>
        )
      ) : (
        <div className="flex w-full flex-col items-center justify-center py-2">
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
      )}

      {isFetchedAfterMount && hasNextPage ? (
        <Button
          className="mx-auto w-full bg-primary text-white"
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {t("loadMore")}
        </Button>
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
