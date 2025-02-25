"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/context/Translation";
import { ICategory } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import ProductsGridView from "@/components/product/ProductsGridView";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";
import { getProductsByCateory } from "@/services/products.service";

type Props = {
  category: ICategory;
};

export default function ViewCategoryProfile({ category }: Props) {
  const { t } = useTranslation();
  const [ref, isInView] = useInView();

  const productsQuery = useInfiniteQuery({
    queryKey: ["categoryProducts", category.seName],
    queryFn: ({ pageParam }) => getProductsByCateory(category._id, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const lastPage = productsQuery.data?.pages.findLast((page) => page);
  const products = productsQuery.data?.pages.map((page) => page.data).flat() ?? [];

  useEffect(() => {
    if (!productsQuery.isFetching && !productsQuery.isFetchingNextPage && isInView && lastPage?.pages.hasNext)
      productsQuery.fetchNextPage();
  }, [isInView, lastPage]);

  return (
    <div className="py-4">
      <div className="mb-2 flex w-full flex-row items-center justify-between px-2 md:mt-0">
        <h1 className="inline-block truncate text-[30px] font-bold capitalize">{category.name}</h1>
        <p className="whitespace-nowrap" dir="ltr">
          <span className="font-bold">{category.productsCount}</span> products
        </p>
      </div>

      <div className="mt-6 border-t" />

      {products.length > 0 || productsQuery.isFetched ? (
        <ProductsGridView products={products} />
      ) : (
        <div className="py-14 text-center text-secondary">{t("profile.noProducts")}</div>
      )}

      {lastPage?.pages.hasNext || !productsQuery.isFetched ? <LoadingSpinner ref={ref} /> : null}
    </div>
  );
}
