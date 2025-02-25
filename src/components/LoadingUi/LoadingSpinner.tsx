import { cn } from "@/lib/utils";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

type Props = React.ComponentPropsWithoutRef<"div">;

export default React.forwardRef<HTMLInputElement, Props>(function LoadingSpinner({ className, ...props }: Props, ref) {
  return (
    <div {...props} className={cn("flex w-full flex-col items-center justify-center py-2", className)} ref={ref}>
      <BiLoaderCircle className="animate-spin fill-primary" size={35} />
    </div>
  );
});
