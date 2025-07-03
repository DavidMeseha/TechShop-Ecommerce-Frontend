import { Button } from "@/common/components/ui/button";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { useTranslation } from "@/common/context/Translation";
import useFollow from "@/web/features/follow-vendor/useFollow";
import { IVendor } from "@/types";
import Image from "next/image";
import React from "react";

type Props = { vendor: IVendor };

const VendorItem = React.memo(
  function ListItem({ vendor }: Props) {
    const { t } = useTranslation();
    const handleFollow = useFollow({ vendor });

    return (
      <li className="mx-2 my-2 flex items-center justify-between rounded-md border p-2">
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
          {vendor.isFollowed ? (
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
    return prev.vendor._id === next.vendor._id && prev.vendor.isFollowed === next.vendor.isFollowed;
  }
);

export default VendorItem;
