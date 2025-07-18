"use client";

import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useTranslation } from "@/common/context/Translation";
import { IVendor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import React from "react";
import useFollow from "@/web/features/follow-vendor/useFollow";
import LoadingSpinner from "@/common/components/loadingUi/LoadingSpinner";
import { getFollowingVendors } from "@/web/services/user.service";
import { FOLLOWING_QUERY_KEY, USER_QUERY_KEY, VENDORS_QUERY_KEY } from "@/common/constants/query-keys";

export default function FollowingPage() {
  const follwingVendorsQuery = useQuery({
    queryKey: [USER_QUERY_KEY, FOLLOWING_QUERY_KEY, VENDORS_QUERY_KEY],
    queryFn: () => getFollowingVendors()
  });
  const vendors = follwingVendorsQuery.data ?? [];

  if (!follwingVendorsQuery.isFetchedAfterMount && !vendors.length) return <LoadingSpinner />;

  if (!vendors.length) return <div className="py-4 text-center text-gray-400">No Followed Vendors</div>;

  return (
    <ul>
      {vendors.map((vendor) => (
        <ListItem key={vendor._id} vendor={vendor} />
      ))}
    </ul>
  );
}

const ListItem = React.memo(
  function ListItem({ vendor }: { vendor: IVendor }) {
    const { t } = useTranslation();
    const handleFollow = useFollow({ vendor });

    return (
      <li className={`${vendor.isFollowed ? "opacity-100" : "opacity-60"} flex items-center justify-between px-4 py-2`}>
        <div className="flex w-full items-center gap-3">
          <Image
            alt={vendor.name}
            className="bg-lightGray h-14 w-14 rounded-full"
            height={66}
            src={vendor.imageUrl}
            width={66}
          />

          <div>
            <LocalLink className="font-bold" href={`/vendor/${vendor.seName}`}>
              {vendor.name}
            </LocalLink>
            <p className="text-gray-400">{vendor.productCount} Products</p>
          </div>
        </div>
        <div>
          <SubmitButton
            className="flex items-center justify-center rounded-md bg-primary font-bold text-white"
            onClick={() => vendor.isFollowed && handleFollow(false)}
          >
            {t("unfollow")}
          </SubmitButton>
        </div>
      </li>
    );
  },
  (prev, next) => prev.vendor._id === next.vendor._id && prev.vendor.isFollowed === next.vendor.isFollowed
);
