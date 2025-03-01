import { cn } from "@/lib/utils";
import { forwardRef, SelectHTMLAttributes } from "react";

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { name: string; value: string }[];
};

export default forwardRef<HTMLSelectElement, DropdownProps>(function Dropdown(
  { label, options, className, ...props },
  ref
) {
  return (
    <>
      <label className="mb-1">{label}</label>
      <select
        className={cn("block w-full rounded-sm border px-4 py-2 focus:border-primary focus:ring-primary", className)}
        ref={ref}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
});
