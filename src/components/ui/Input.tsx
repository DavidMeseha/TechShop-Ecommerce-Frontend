import { cn } from "@/lib/cn";
import React, { forwardRef } from "react";

type Props = React.ComponentPropsWithoutRef<"input"> & {
  label?: string;
  className?: string;
};

export default forwardRef<HTMLInputElement, Props>(function Input({ label, className, ...props }: Props, ref) {
  return (
    <>
      <label className="mb-1 text-[15px]">{label}</label>
      <input
        ref={ref}
        {...props}
        className={cn("w-full rounded-sm border focus:border-primary focus:ring-primary", className)}
      />
    </>
  );
});
