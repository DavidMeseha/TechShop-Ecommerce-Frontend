"use client";

import { useTranslation } from "@/common/context/Translation";
import React from "react";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "@/common/components/loadingUi/LoadingSpinner";
import { CATEGORIES_QUERY_KEY, DISCOVER_QUERY_KEY } from "@/common/constants/query-keys";
import { getCategories } from "@/web/services/catalog.service";
import CategoryItem from "../components/CategoryItem";

export default function CategoriesDiscoverPage() {
  const { t } = useTranslation();

  const { hasNextPage, fetchNextPage, isFetching, data, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [CATEGORIES_QUERY_KEY, DISCOVER_QUERY_KEY],
    queryFn: ({ pageParam }) => getCategories({ page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });

  const categories = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <ul>
        {categories.map((category) => (
          <CategoryItem category={category} key={category._id} />
        ))}
      </ul>

      {isFetching ? (
        <Loading />
      ) : hasNextPage ? (
        <div className="px-w py-4 text-center">
          <SubmitButton
            className="w-full bg-primary text-white"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {t("loadMore")}
          </SubmitButton>
        </div>
      ) : null}
    </>
  );
}
