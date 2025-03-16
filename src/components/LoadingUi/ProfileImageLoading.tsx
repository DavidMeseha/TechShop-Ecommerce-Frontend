import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function ProfileImageLoading() {
  return (
    <SkeletonTheme baseColor="#d5d5d5" highlightColor="#ececec">
      <Skeleton circle className="h-full w-full" />
    </SkeletonTheme>
  );
}
