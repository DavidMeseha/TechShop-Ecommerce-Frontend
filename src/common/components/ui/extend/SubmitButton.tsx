import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { Button } from "../button";
import { cn } from "@/common/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  isLoading?: boolean;
  spinnerSize?: number | string;
};

export function SubmitButton({ className, isLoading, spinnerSize = 24, ...props }: Props) {
  return (
    <Button {...props} className={cn("relative rounded-sm fill-white px-4 py-2", className)} disabled={isLoading}>
      {isLoading && (
        <div className="absolute inset-0 flex w-full items-center justify-center rounded-md bg-inherit">
          <BiLoaderCircle className="animate-spin fill-inherit" size={spinnerSize} />
        </div>
      )}
      <div className="rounded-sm2">{props.children}</div>
    </Button>
  );
}
