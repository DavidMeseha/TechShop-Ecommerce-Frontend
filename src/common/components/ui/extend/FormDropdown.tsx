import React from "react";
import { FieldError } from "@/types";
import { BiLoaderCircle } from "react-icons/bi";
import { Label } from "../label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import { SelectProps } from "@radix-ui/react-select";
import ErrorMessage from "./ErrorMessage";

export interface FormDropdownInputProps extends SelectProps {
  label: string;
  error?: FieldError;
  options: { name: string; value: string }[];
  isLoading?: boolean;
}

function FormDropdown({ label, error, options, isLoading, ...props }: FormDropdownInputProps) {
  return (
    <div className="relative pb-1">
      <Label htmlFor={label}>{label}</Label>
      <Select {...props}>
        <SelectTrigger>
          <SelectValue id={label} placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading ? (
        <div className="absolute inset-0 top-6 flex w-full justify-center bg-white bg-opacity-50 py-2.5">
          <BiLoaderCircle className="animate-spin fill-gray-600" size={24} />
        </div>
      ) : null}
      <ErrorMessage error={error} />
    </div>
  );
}

FormDropdown.displayName = "FormDropdown";
export default FormDropdown;
