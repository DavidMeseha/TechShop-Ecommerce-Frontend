import React from "react";
import { AppProgressProvider as ProgressBar } from "@bprogress/next";

type Props = {
  children: React.ReactNode;
};

export default function ProgressBarBar({ children }: Props) {
  return (
    <>
      <ProgressBar color="#2929cc" height="3px" options={{ showSpinner: false }} shallowRouting>
        {children}
      </ProgressBar>
    </>
  );
}
