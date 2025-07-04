"use client";

import { useTranslation } from "@/common/context/Translation";
import { ITag } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import ProductsGridView from "@/web/components/product/ProductsGridView";
import { getProductsByTag } from "@/web/services/catalog.service";
import { PRODUCTS_QUERY_KEY, SINGLE_TAG_QUERY_KEY } from "@/common/constants/query-keys";

type Props = {
  tag: ITag;
};

export default function TagProfilePage({ tag }: Props) {
  const { t } = useTranslation();
  const [ref] = useInView({
    onChange: (inView) => {
      if (!isFetchingNextPage && inView && hasNextPage) fetchNextPage();
    }
  });

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching, isFetchedAfterMount } = useInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, SINGLE_TAG_QUERY_KEY, tag.seName],
    queryFn: ({ pageParam }) => getProductsByTag(tag.seName, { page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });

  const products = data?.pages.map((page) => page.data).flat() ?? [];

  return (
    <div className="py-4">
      <div className="mb-2 ms-2 flex w-full flex-row items-center justify-between px-4 md:mt-0">
        <p className="inline-block truncate text-[20px] font-bold" dir="ltr">
          #{tag.name}
        </p>
        <p dir="ltr">
          <span className="font-bold">{tag.productCount}</span> products
        </p>
      </div>

      <div className="mt-6 border-t pt-4" />

      <div className="px-2">
        {products.length < 1 && isFetchedAfterMount ? (
          <div className="py-14 text-center text-gray-400">{t("profile.noProducts")}</div>
        ) : (
          <ProductsGridView isLoading={isFetchingNextPage || isFetching} limit={5} products={products} />
        )}
      </div>

      {hasNextPage ? <div className="h-4" ref={ref} /> : null}
    </div>
  );
}
