"use client";

import React from "react";
import { useTranslation } from "@/context/Translation";
import { ICategory } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import ProductsGridView from "@/components/product/ProductsGridView";
import { getProductsByCateory } from "@/services/products.service";

type Props = {
  category: ICategory;
};

export default function CategoryProfilePage({ category }: Props) {
  const { t } = useTranslation();
  const [ref] = useInView({
    onChange: (inView) => {
      if (!isFetchingNextPage && inView && hasNextPage) fetchNextPage();
    }
  });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching, isFetchedAfterMount } = useInfiniteQuery({
    queryKey: ["categoryProducts", category.seName],
    queryFn: ({ pageParam }) => getProductsByCateory(category._id, { page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });

  const products = data?.pages.map((page) => page.data).flat() ?? [];

  return (
    <div className="py-4">
      <div className="mb-2 flex w-full flex-row items-center justify-between px-2 md:mt-0">
        <h1 className="inline-block truncate text-[30px] font-bold capitalize">{category.name}</h1>
        <p className="whitespace-nowrap" dir="ltr">
          <span className="font-bold">{category.productsCount}</span> products
        </p>
      </div>

      <div className="mt-6 border-t pt-4" />

      {products.length < 1 && isFetchedAfterMount ? (
        <div className="py-14 text-center text-gray-400">{t("profile.noProducts")}</div>
      ) : (
        <ProductsGridView isLoading={isFetchingNextPage || isFetching} limit={5} products={products} />
      )}

      {hasNextPage ? <div className="h-4" ref={ref} /> : null}
    </div>
  );
}
