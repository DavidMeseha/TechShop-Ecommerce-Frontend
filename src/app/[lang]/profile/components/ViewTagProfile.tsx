"use client";

import { useTranslation } from "@/context/Translation";
import { IFullProduct, ITag, Pagination } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BiLoaderCircle } from "react-icons/bi";
import ProductCard from "@/components/product/Card";

type Props = {
  tag: ITag;
};

export default function ViewtagProfile({ tag }: Props) {
  const { t } = useTranslation();
  const [ref, isInView] = useInView();

  const productsQuery = useInfiniteQuery({
    queryKey: ["tagProducts", tag._id],
    queryFn: ({ pageParam }) =>
      axios
        .get<{ data: IFullProduct[]; pages: Pagination }>(`/api/Catalog/TagProducts/${tag._id}`, {
          params: {
            page: pageParam
          }
        })
        .then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const lastPage = productsQuery.data?.pages.findLast((page) => page);

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

      {productsQuery.isFetchedAfterMount ? (
        productsQuery.data && productsQuery.data.pages[0].data.length > 0 ? (
          <div className="relative mt-4 grid grid-cols-2 gap-3 px-4 pb-20 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {productsQuery.data.pages.map((page) =>
              page.data.map((product, index) => <ProductCard key={index} product={product} />)
            )}
          </div>
        ) : (
          <div className="py-14 text-center text-secondary">{t("profile.noProducts")}</div>
        )
      ) : null}

      {lastPage?.pages.hasNext || !productsQuery.isFetchedAfterMount ? (
        <div className="w-sfull flex flex-col items-center justify-center py-2" ref={ref}>
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
      ) : null}
    </div>
  );
}
