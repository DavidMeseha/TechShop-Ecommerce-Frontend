"use client";

import { useTranslation } from "@/context/Translation";
import { ITag } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BiLoaderCircle } from "react-icons/bi";
import ProductsGridView from "@/components/product/ProductsGridView";
import { getProductsByTag } from "@/services/products.service";

type Props = {
  tag: ITag;
};

export default function ViewtagProfile({ tag }: Props) {
  const { t } = useTranslation();
  const [ref, isInView] = useInView();

  const productsQuery = useInfiniteQuery({
    queryKey: ["tagProducts", tag._id],
    queryFn: ({ pageParam }) => getProductsByTag(tag._id, { page: pageParam }),
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
      <div className="mb-2 ms-2 flex w-full flex-row items-center justify-between px-4 md:mt-0">
        <p className="inline-block truncate text-[30px] font-bold" dir="ltr">
          #{tag.name}
        </p>
        <p dir="ltr">
          <span className="font-bold">{tag.productCount}</span> products
        </p>
      </div>

      <div className="mt-6 border-t" />

      {products.length > 0 || productsQuery.isFetched ? (
        <ProductsGridView products={products} />
      ) : (
        <div className="py-14 text-center text-secondary">{t("profile.noProducts")}</div>
      )}

      {lastPage?.pages.hasNext || !productsQuery.isFetched ? (
        <div className="flex w-full flex-col items-center justify-center py-2" ref={ref}>
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
      ) : null}
    </div>
  );
}
