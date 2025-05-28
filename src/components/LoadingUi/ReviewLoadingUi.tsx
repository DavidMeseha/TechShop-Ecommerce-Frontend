import React from "react";
import Skeleton from "react-loading-skeleton";
import LoadingTheme from "./LoadingTheme";

export default function ReviewItemLoadingUi() {
  return (
    <LoadingTheme>
      <div className="mb-4 flex items-start gap-3">
        <Skeleton height={50} width={50} />
        <div className="bg-lightGray w-11/12 rounded-md p-2">
          <div className="flex items-center gap-2">
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={100} />
          </div>
          <Skeleton height={20} width={100} />
          <Skeleton height={20} width={100} />
        </div>
      </div>
    </LoadingTheme>
  );
}
