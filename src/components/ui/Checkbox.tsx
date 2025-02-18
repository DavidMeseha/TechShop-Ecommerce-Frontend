import { cn } from "@/lib/utils";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function Checkbox({ label, id, className, ...props }: Props) {
  return (
    <label className={cn("block px-4 py-2", className)} htmlFor={id}>
      <input
        className="mb-1 me-2 border-primary-300 bg-primary-100 text-primary focus:ring-primary-100"
        id={id}
        type="checkbox"
        {...props}
      />
      {label}
    </label>
  );
}
