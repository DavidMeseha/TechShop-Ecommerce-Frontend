import { AppProgressBar } from "next-nprogress-bar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProgressBarProvider({ children }: Props) {
  return (
    <>
      <AppProgressBar color="#2929cc" height="4px" options={{ showSpinner: false }} shallowRouting />
      {children}
    </>
  );
}
