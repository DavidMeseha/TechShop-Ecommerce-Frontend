"use client";

import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { getUserReviews } from "@/web/services/user.service";
import { useTranslation } from "@/common/context/Translation";
import { REVIEWS_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import ReviewItem from "./components/ReviewItem";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";

export default function ReviewsPage() {
  const { t } = useTranslation();

  const { hasNextPage, fetchNextPage, data, isPending, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [USER_QUERY_KEY, REVIEWS_QUERY_KEY],
    queryFn: ({ pageParam }) => getUserReviews({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined)
  });
  const reviews = data?.pages.flatMap((page) => page.data) ?? [];

  if (isPending)
    return (
      <div className="py-20">
        <LoadingSpinner />;
      </div>
    );

  return (
    <ul className="block px-4">
      {reviews.length > 0 ? (
        reviews.map((review) => <ReviewItem key={review._id} review={review} />)
      ) : (
        <div className="py-14 text-center text-gray-400">{t("profile.noReviews")}</div>
      )}

      {hasNextPage && (
        <SubmitButton
          className="mx-auto w-full bg-primary text-white"
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {t("loadMore")}
        </SubmitButton>
      )}
    </ul>
  );
}
