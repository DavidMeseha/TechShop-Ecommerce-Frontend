"use client";
import React from "react";
import { FieldError } from "../types";
import Input from "./ui/Input";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  className?: string;
}

export default function FormTextInput({ label, error, ...props }: TextInputProps) {
  return (
    <>
      <label className="mb-1 block capitalize">
        {label}
        {props.required ? <span className="text-primary">*</span> : null}
      </label>
      <Input autoComplete="off" className="block w-full rounded-sm border border-secondary px-4 py-2" {...props} />
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error ? error : null}</div>
    </>
  );
}
