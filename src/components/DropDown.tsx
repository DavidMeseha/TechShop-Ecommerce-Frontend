import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { name: string; value: string }[];
};

export default function Dropdown({ label, options, className, ...props }: DropdownProps) {
  return (
    <>
      <label className="mb-1">{label}</label>
      <select
        className={cn(
          "block w-full rounded-sm border border-secondary px-4 py-2 focus:border-primary focus:ring-primary",
          className
        )}
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
}
