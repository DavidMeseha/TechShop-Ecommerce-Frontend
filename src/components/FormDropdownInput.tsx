import React from "react";
import { FieldError } from "../types";
import { BiLoaderCircle } from "react-icons/bi";

export interface DropdownProps {
  value: string | undefined;
  label: string;
  onUpdate: (newValue: string, name: string) => void;
  error?: FieldError;
  options: { name: string; value: string }[];
  name: string;
  isLoading?: boolean;
}

export default function FormDropdownInput({ value, label, error, onUpdate, options, name, isLoading }: DropdownProps) {
  return (
    <div className="relative pb-1">
      <label>{label}</label>
      <select
        className="block w-full rounded-sm border px-4 py-2 focus:border-primary focus:ring-primary"
        dir="ltr"
        name={name}
        value={value}
        onChange={(event) => onUpdate(event.target.value, event.target.name)}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {isLoading ? (
        <div className="absolute inset-0 top-6 flex w-full justify-center bg-white bg-opacity-50 py-2.5" key={0}>
          <BiLoaderCircle className="animate-spin fill-gray-600" size={24} />
        </div>
      ) : null}
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error ? error : null}</div>
    </div>
  );
}
