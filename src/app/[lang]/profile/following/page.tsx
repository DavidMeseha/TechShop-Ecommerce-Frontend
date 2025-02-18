"use client";

import Button from "@/components/ui/Button";
import { useTranslation } from "@/context/Translation";
import { IVendor } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import useFollow from "@/hooks/useFollow";
import { followings } from "@/actions";
import { usePathname } from "next/navigation";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import { useUserStore } from "@/stores/userStore";

export default function FollowingPage() {
  const pathname = usePathname();
  const follwingVendorsQuery = useQuery({
    queryKey: ["following"],
    queryFn: () => followings(pathname)
  });

  if (follwingVendorsQuery.isFetching) return <Loading />;
  if (!follwingVendorsQuery.data?.length)
    return <div className="py-4 text-center text-secondary">No Followed Vendors</div>;
  return <ul>{follwingVendorsQuery.data?.map((vendor) => <ListItem key={vendor._id} vendor={vendor} />)}</ul>;
}

function ListItem({ vendor }: { vendor: IVendor }) {
  const { t } = useTranslation();
  const { following, setFollowedVendors } = useUserStore();

  const { handleFollow } = useFollow({
    vendor,
    onClick: (follow) => {
      const temp = [...following];
      follow ? temp.splice(temp.indexOf(vendor._id), 1) : temp.push(vendor._id);
      setFollowedVendors([...temp]);
    }
  });

  return (
    <li className="flex items-center justify-between px-4 py-2">
      <div className="flex w-full items-center gap-3">
        <Image
          alt={vendor.name}
          className="h-14 w-14 rounded-full bg-lightGray"
          height={66}
          src={vendor.imageUrl}
          width={66}
        />

        <div>
          <LocalLink className="font-bold" href={`/profile/vendor/${vendor.seName}`}>
            {vendor.name}
          </LocalLink>
          <p className="text-secondary">{vendor.productCount} Products</p>
        </div>
      </div>
      <div>
        <Button
          className="flex items-center justify-center rounded-md bg-primary font-bold text-white"
          onClick={() => handleFollow(false)}
        >
          {t("unfollow")}
        </Button>
      </div>
    </li>
  );
}
