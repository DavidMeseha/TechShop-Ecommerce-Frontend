"use client";

import React from "react";
import { LocalLink } from "@/components/LocalizedNavigation";
import Image from "next/image";
import { IVendor } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useUserStore } from "@/stores/userStore";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import useFollow from "@/hooks/useFollow";
import { useTranslation } from "@/context/Translation";
import { getVendors } from "@/services/products.service";

export default function Page() {
  const followedVendors = useUserStore((state) => state.followedVendors);
  const { t } = useTranslation();

  const { hasNextPage, fetchNextPage, isFetching, data, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["vendorsDiscover"],
    queryFn: ({ pageParam }) => getVendors({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined)
  });

  const vendors = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <ul>
        {vendors.map((vendor) => (
          <MemoizedListItem isFollowed={followedVendors.includes(vendor._id)} key={vendor._id} vendor={vendor} />
        ))}
      </ul>

      {isFetching ? (
        <Loading />
      ) : hasNextPage ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {t("loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
}

const MemoizedListItem = React.memo(
  function ListItem({ vendor, isFollowed }: { vendor: IVendor; isFollowed: boolean }) {
    const { t } = useTranslation();
    const handleFollow = useFollow({ vendor });

    return (
      <li className="flex items-center justify-between px-4 py-2">
        <div className="flex w-full items-center gap-3">
          <Image
            alt={vendor.name}
            className="bg-lightGray h-14 w-14 rounded-full object-cover"
            height={56}
            src={vendor.imageUrl}
            width={56}
          />

          <div>
            <LocalLink className="font-bold hover:underline" href={`/vendor/${vendor.seName}`}>
              {vendor.name}
            </LocalLink>
            <p className="text-gray-400">Products: {vendor.productCount}</p>
          </div>
        </div>
        <div>
          {isFollowed ? (
            <div className="text-gray-400">{t("profile.following")}</div>
          ) : (
            <Button className="bg-primary px-4 font-bold text-white" onClick={() => handleFollow(true)}>
              +
            </Button>
          )}
        </div>
      </li>
    );
  },
  (prev, next) => {
    return prev.isFollowed === next.isFollowed && prev.vendor._id === next.vendor._id;
  }
);
