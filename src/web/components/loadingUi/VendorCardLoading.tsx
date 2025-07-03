import React from "react";
import LoadingTheme from "../../../common/components/loadingUi/LoadingSkeletonTheme";
import Skeleton from "react-loading-skeleton";

export default function VendorCardLoading() {
  return (
    <LoadingTheme>
      <div className="w-40 rounded-md border px-2 py-2">
        <Skeleton circle className="mx-auto" height={108} width={108} />
        <Skeleton className="mx-auto" height={24} />
        <Skeleton className="mt-3" height={32} />
      </div>
    </LoadingTheme>
  );
}
