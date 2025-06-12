import { cn } from "@/lib/cn";
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
      <label className="mb-1" htmlFor={label}>
        {label}
      </label>
      <select
        className={cn("block w-full rounded-sm border px-4 py-2 focus:border-primary focus:ring-primary", className)}
        id={label}
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
