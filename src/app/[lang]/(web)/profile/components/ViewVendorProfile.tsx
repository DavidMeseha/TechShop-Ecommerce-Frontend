"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "@/context/Translation";
import { UserActivity } from "./UserActivity";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { IVendor } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { BiLoaderCircle } from "react-icons/bi";
import { useUserStore } from "@/stores/userStore";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import useFollow from "@/hooks/useFollow";
import ProductsGridView from "@/components/product/ProductsGridView";
import { getProductsByVendor } from "@/services/products.service";

type Props = {
  vendor: IVendor;
};

export default function ViewVendorProfile({ vendor }: Props) {
  const followedVendors = useUserStore((state) => state.followedVendors);

  const [followersCount, setFollowersCount] = useState(vendor.followersCount);
  const { t } = useTranslation();
  const [ref] = useInView({
    onChange: (inView) => {
      if (!productsQuery.isFetching && !productsQuery.isFetchingNextPage && inView && lastPage?.pages.hasNext)
        productsQuery.fetchNextPage();
    }
  });

  const activities = useMemo(
    () => [
      {
        name: t("profile.followers"),
        value: followersCount,
        to: null
      },
      {
        name: t("profile.products"),
        value: vendor.productCount,
        to: null
      }
    ],
    [followersCount, vendor.productCount]
  );

  const handleFollow = useFollow({
    vendor,
    onClick: (shouldFollow) => setFollowersCount(followersCount + (shouldFollow ? 1 : -1))
  });

  const productsQuery = useInfiniteQuery({
    queryKey: ["vendorProducts", vendor._id],
    queryFn: ({ pageParam }) => getProductsByVendor(vendor._id, { page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1
  });
  const lastPage = productsQuery.data?.pages.findLast((page) => page);
  const products = productsQuery.data?.pages.map((page) => page.data).flat() ?? [];

  return (
    <div className="py-4">
      <div className="flex w-full flex-row items-center justify-start px-4 md:mt-0">
        <Image
          alt={vendor.name}
          className="h-[80px] w-[80px] rounded-md object-cover"
          height={140}
          src={vendor.imageUrl}
          width={140}
        />

        <div className="ms-5">
          <div className="flex items-center gap-4">
            <h1 className="inline-block truncate text-2xl font-bold" dir="ltr">
              {vendor.name}
            </h1>
            <RiVerifiedBadgeFill className="fill-primary" size={25} />
          </div>
          <Button
            className="item-center mt-3 block bg-primary px-8 py-1.5 text-[15px] font-semibold text-white"
            onClick={() => handleFollow(!followedVendors.includes(vendor._id))}
          >
            {followedVendors.includes(vendor._id) ? t("unfollow") : t("follow")}
          </Button>
        </div>
      </div>

      <UserActivity activities={activities} />

      <div className="mt-2 border-t" />

      {products.length > 0 || productsQuery.isFetched ? (
        <ProductsGridView products={products} />
      ) : (
        <div className="py-14 text-center text-gray-400">{t("profile.noProducts")}</div>
      )}

      {lastPage?.pages.hasNext || !productsQuery.isFetched ? (
        <div className="flex w-full flex-col items-center justify-center py-2" ref={ref}>
          <BiLoaderCircle className="animate-spin fill-primary" size={35} />
        </div>
      ) : null}
    </div>
  );
}
