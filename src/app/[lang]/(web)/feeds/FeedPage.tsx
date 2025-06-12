"use client";

import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/context/Translation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/catalog.service";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";
import { FEED_QUERY_KEY, PRODUCTS_QUERY_KEY } from "@/constants/query-keys";
import MobileFeedDisplay from "@/app/[lang]/(web)/feeds/sections/MobileFeedDisplay";
import MainFeedDisplay from "./sections/MainFeedDisplay";

export default function FeedPage() {
  const { t } = useTranslation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, FEED_QUERY_KEY],
    queryFn: async ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: 3 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const [ref] = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  });

  return (
    <>
      <MainFeedDisplay products={products} />
      <MobileFeedDisplay isFetchingNextPage={isFetchingNextPage} products={products} />

      {hasNextPage ? (
        <>
          <div className="absolute bottom-0 -z-10 h-screen md:h-[700px]" data-testid="load-more" ref={ref}></div>
          <LoadingSpinner className="py-6" />
        </>
      ) : (
        <div className="py-4 text-center text-muted-foreground">{t("endOfContent")}</div>
      )}
    </>
  );
}
