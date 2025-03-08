import React from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

type Props = {
  children: React.ReactNode;
};

export default function ProgressBarProvider({ children }: Props) {
  return (
    <>
      <ProgressProvider color="#2929cc" height="3px" options={{ showSpinner: false }} shallowRouting>
        {children}
      </ProgressProvider>
    </>
  );
}
