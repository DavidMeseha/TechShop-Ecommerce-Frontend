import React from "react";
import ProductsGridView from "./product/ProductsGridView";
import Button from "./ui/Button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "@/context/Translation";
import { homeFeedProducts } from "@/services/products.service";
import { useInView } from "react-intersection-observer";

const PRODUCTS_LIMIT = 5;

export default function MoreProducts() {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["moreProducts"],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: PRODUCTS_LIMIT }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1,
    enabled: inView
  });
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <div ref={ref}>
        <ProductsGridView
          isLoading={isLoading || isFetchingNextPage || !data}
          limit={PRODUCTS_LIMIT}
          products={products}
        />
      </div>
      <div className="flex justify-center pt-4">
        {hasNextPage ? (
          <Button className="bg-primary text-white" onClick={() => fetchNextPage()}>
            {t("loadMore")}
          </Button>
        ) : null}
      </div>
    </>
  );
}
