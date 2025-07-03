import React from "react";
import Skeleton from "react-loading-skeleton";
import LoadingTheme from "../../../../common/components/loadingUi/LoadingSkeletonTheme";

export default function ProfileImageLoading() {
  return (
    <LoadingTheme>
      <Skeleton circle className="h-full w-full" />
    </LoadingTheme>
  );
}
