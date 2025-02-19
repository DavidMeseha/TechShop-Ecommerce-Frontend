"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import { PiPlus } from "react-icons/pi";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { IVendor } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { BiDownArrow } from "react-icons/bi";
import { toast } from "react-toastify";
import { followVendor } from "@/services/userActions.service";

type Props = {
  vendor: IVendor;
};

export default function ProductVendorButton({ vendor }: Props) {
  const { following, setFollowedVendors } = useUserStore();
  const followMutation = useMutation({
    mutationKey: ["followVendor", vendor._id],
    mutationFn: () => followVendor(vendor._id),
    onSuccess: () => {
      setFollowedVendors();
      toast.success("Vendor followed successfully");
    }
  });

  return (
    <div className="relative mx-2 mb-7">
      <LocalLink aria-label="Navigate to vendor profile" href={`/profile/vendor/${vendor.seName}`}>
        <Image
          alt={vendor.name}
          className="h-10 w-10 rounded-full object-cover"
          height={50}
          src={vendor.imageUrl}
          width={50}
        />
      </LocalLink>
      {!following.includes(vendor._id) ? (
        <button className="absolute -bottom-2 flex w-full justify-center" onClick={() => followMutation.mutate()}>
          <div className="rounded-full bg-primary p-1">
            <PiPlus className="fill-white" size={10} />
          </div>
        </button>
      ) : followMutation.isSuccess ? (
        <button className="absolute -bottom-2 flex w-full justify-center" onClick={() => followMutation.mutate()}>
          <div className="rounded-full bg-primary p-1">
            <BiDownArrow className="fill-white" size={10} />
          </div>
        </button>
      ) : null}
    </div>
  );
}
