"use client";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/context/Translation";
import { IVendor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LocalLink } from "@/components/LocalizedNavigation";
import React, { useState } from "react";
import useFollow from "@/hooks/useFollow";
import LoadingSpinner from "@/components/LoadingUi/LoadingSpinner";
import { getFollowingVendors } from "@/services/user.service";

export default function FollowingPage() {
  const follwingVendorsQuery = useQuery({
    queryKey: ["following"],
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
    const [isFollowed, setIsFollowed] = useState(vendor.isFollowed);
    const { t } = useTranslation();
    const handleFollow = useFollow({
      vendor,
      onClick: (shouldFollow) => setIsFollowed(shouldFollow),
      onError: (shouldFollow) => setIsFollowed(!shouldFollow)
    });

    return (
      <li className={`${isFollowed ? "opacity-100" : "opacity-60"} flex items-center justify-between px-4 py-2`}>
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
          <Button
            className="flex items-center justify-center rounded-md bg-primary font-bold text-white"
            onClick={() => isFollowed && handleFollow(false)}
          >
            {t("unfollow")}
          </Button>
        </div>
      </li>
    );
  },
  (prev, next) => prev.vendor._id === next.vendor._id && prev.vendor.isFollowed === next.vendor.isFollowed
);
