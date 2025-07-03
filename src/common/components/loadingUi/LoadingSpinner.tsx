import { cn } from "@/common/lib/utils";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

type Props = React.ComponentPropsWithoutRef<"div"> & {
  size?: number;
};

export default React.forwardRef<HTMLInputElement, Props>(function LoadingSpinner(
  { className, size = 35, ...props }: Props,
  ref
) {
  return (
    <div
      {...props}
      className={cn("flex w-full flex-col items-center justify-center fill-primary py-2", className)}
      ref={ref}
      role="status"
    >
      <BiLoaderCircle className="animate-spin fill-inherit" size={size} />
    </div>
  );
});
