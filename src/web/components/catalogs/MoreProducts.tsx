"use client";

import React from "react";
import ProductsGridView from "../product/ProductsGridView";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "@/common/context/Translation";
import { homeFeedProducts } from "@/web/services/catalog.service";
import { useInView } from "react-intersection-observer";
import SectionHeader from "@/common/components/ui/extend/SectionHeader";
import { PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import { useUserStore } from "@/common/stores/userStore";

const PRODUCTS_LIMIT = 5;

export default function MoreProducts() {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const user = useUserStore((state) => state.user);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: PRODUCTS_LIMIT }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1,
    enabled: inView && !!user
  });
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <SectionHeader title={t("moreProducts")} />

      <div ref={ref}>
        <ProductsGridView
          isLoading={isLoading || isFetchingNextPage || !data}
          limit={PRODUCTS_LIMIT}
          products={products}
        />
      </div>
      <div className="flex justify-center pt-4">
        {hasNextPage ? (
          <SubmitButton className="bg-primary text-white" onClick={() => fetchNextPage()}>
            {t("loadMore")}
          </SubmitButton>
        ) : null}
      </div>
    </>
  );
}
