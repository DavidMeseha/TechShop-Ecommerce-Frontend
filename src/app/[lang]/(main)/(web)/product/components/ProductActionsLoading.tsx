import React from "react";
import LoadingTheme from "@/common/components/loadingUi/LoadingSkeletonTheme";
import Skeleton from "react-loading-skeleton";

type Props = {
  count?: number;
};

export default function ProductActionsLoading({ count = 3 }: Props) {
  return (
    <LoadingTheme>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <Skeleton circle className="-my-1" height={41} width={41} />
          <p className="text-center text-gray-300">0</p>
        </div>
      ))}
    </LoadingTheme>
  );
}
