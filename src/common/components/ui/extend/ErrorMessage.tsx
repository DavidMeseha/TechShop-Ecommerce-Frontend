import React from "react";
import { RiErrorWarningFill } from "react-icons/ri";

type Props = {
  error: string | null | undefined;
  persistSpace?: boolean | string;
};

export default function ErrorMessage({ error, persistSpace = true }: Props) {
  return (
    <div
      className={`flex items-center gap-1 text-[14px] font-semibold text-destructive ${persistSpace ? "min-h-[21px]" : ""}`}
    >
      {error && <RiErrorWarningFill />}
      {error}
    </div>
  );
}
