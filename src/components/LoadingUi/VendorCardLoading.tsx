import React from "react";
import LoadingTheme from "./LoadingTheme";
import Skeleton from "react-loading-skeleton";

export default function VendorCardLoading() {
  return (
    <LoadingTheme>
      <div className="w-32 rounded-md border px-2 py-2">
        <Skeleton circle height={108} width={108} />
        <Skeleton height={24} />
        <Skeleton className="mt-3" height={32} />
      </div>
    </LoadingTheme>
  );
}
