"use client";

import { ICategory } from "@/types";
import { useTranslation } from "@/context/Translation";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import Button from "@/components/ui/Button";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import { getCategories } from "@/services/products.service";
import { CATEGORIES_QUERY_KEY, DISCOVER_QUERY_KEY } from "@/constants/query-keys";

type ListItemProps = {
  category: ICategory;
  to: string;
};

export default function Page() {
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
          <ListItem category={category} key={category._id} to={`/category/${category.seName}`} />
        ))}
      </ul>
      {isFetching ? (
        <Loading />
      ) : hasNextPage ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {t("loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
}

function ListItem({ to, category }: ListItemProps) {
  const { t } = useTranslation();

  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <LocalLink className="font-bold hover:underline" href={to}>
          {category.name}
        </LocalLink>
      </div>
      <p className="text-gray-400">
        {t("discover.products")}: {category.productsCount || 0}
      </p>
    </li>
  );
}
