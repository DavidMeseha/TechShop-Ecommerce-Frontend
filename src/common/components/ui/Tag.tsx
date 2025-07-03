import { cn } from "@/common/lib/utils";
import React from "react";

type TagVariant = "warn" | "error" | "success" | "normal";
type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  variant?: TagVariant;
};

const variantStyles: Record<TagVariant, string> = {
  warn: "bg-yellow-100 text-yellow-700",
  error: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
  normal: "bg-gray-100 text-gray-700"
};

export default function Tag({ children, className, variant = "normal", ...props }: Props) {
  return (
    <div
      className={cn(
        "z-20 rounded-sm bg-red-200 px-2 py-1 text-[0.6rem] text-destructive",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
