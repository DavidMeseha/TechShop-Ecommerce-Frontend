"use client";

import { useTranslation } from "@/context/Translation";
import Button from "@/components/ui/Button";
import ProductsGridView from "@/components/product/ProductsGridView";
import { useInfiniteQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/products.service";

export default function HomePage() {
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["homeProducts"],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true
  });
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <div className="relative pt-6">
        <ProductsGridView isLoading={isLoading || isFetchingNextPage} limit={10} products={products} />
        <div className="flex justify-center py-4">
          {hasNextPage ? (
            <Button className="bg-primary text-white" onClick={() => fetchNextPage()}>
              {t("loadMore")}
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}
