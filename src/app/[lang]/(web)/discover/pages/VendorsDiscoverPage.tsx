"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useTranslation } from "@/common/context/Translation";
import { DISCOVER_QUERY_KEY, VENDORS_QUERY_KEY } from "@/common/constants/query-keys";
import { getVendors } from "@/web/services/catalog.service";
import ListItemBlockLoading from "@/web/components/loadingUi/ListItemBlockLoading";
import VendorItem from "../components/VendorItem";

export default function VendorsDiscoverPage() {
  const { t } = useTranslation();

  const { hasNextPage, fetchNextPage, isPending, data, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [VENDORS_QUERY_KEY, DISCOVER_QUERY_KEY],
    queryFn: ({ pageParam }) => getVendors({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });

  const vendors = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      {isPending ? (
        Array.from({ length: 4 }, (_, index) => <ListItemBlockLoading height={74} key={index} />)
      ) : (
        <ul>
          {vendors.map((vendor) => (
            <VendorItem key={vendor._id} vendor={vendor} />
          ))}
        </ul>
      )}

      {hasNextPage && (
        <div className="py-4 text-center">
          <SubmitButton
            className="bg-primary text-white"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {t("loadMore")}
          </SubmitButton>
        </div>
      )}
    </>
  );
}
