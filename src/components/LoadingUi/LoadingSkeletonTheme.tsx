import React, { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

type Props = {
  children: ReactNode;
};

export default function LoadingSkeletonTheme({ children }: Props) {
  return (
    <SkeletonTheme baseColor="#d5d5d5" highlightColor="#ececec">
      {children}
    </SkeletonTheme>
  );
}
