"use client";
import React, { forwardRef } from "react";
import { FieldError } from "@/types";
import Input from "./Input";

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function FormTextInput(
  { label, error, required, ...props },
  ref
) {
  return (
    <>
      <label className="mb-1 block capitalize">
        {label}
        {required ? <span className="text-primary">*</span> : null}
      </label>
      <Input {...props} className={`${error ? "border-red-500" : ""}`} ref={ref} />
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{error ? error : null}</div>
    </>
  );
});
