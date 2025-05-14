import React, { forwardRef } from "react";
import { FieldError } from "../types";
import { BiLoaderCircle } from "react-icons/bi";

export interface FormDropdownInputProps extends React.HTMLProps<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  options: { name: string; value: string }[];
  isLoading?: boolean;
}

const FormDropdownInput = forwardRef<HTMLSelectElement, FormDropdownInputProps>(
  ({ label, error, options, isLoading, ...props }, ref) => {
    return (
      <div className="relative pb-1">
        <label htmlFor={label}>{label}</label>
        <select
          {...props}
          className="block w-full rounded-sm border px-4 py-2 focus:border-primary focus:ring-primary"
          dir="ltr"
          id={label}
          ref={ref}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {isLoading ? (
          <div className="absolute inset-0 top-6 flex w-full justify-center bg-white bg-opacity-50 py-2.5">
            <BiLoaderCircle className="animate-spin fill-gray-600" size={24} />
          </div>
        ) : null}
        <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error ? error : null}</div>
      </div>
    );
  }
);

FormDropdownInput.displayName = "FormDropdownInput";
export default FormDropdownInput;
