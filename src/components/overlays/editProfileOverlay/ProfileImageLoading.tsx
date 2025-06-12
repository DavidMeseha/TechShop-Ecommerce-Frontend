import React from "react";
import Skeleton from "react-loading-skeleton";
import LoadingTheme from "../../LoadingUi/LoadingTheme";

export default function ProfileImageLoading() {
  return (
    <LoadingTheme>
      <Skeleton circle className="h-full w-full" />
    </LoadingTheme>
  );
}
