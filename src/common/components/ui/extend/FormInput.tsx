"use client";
import React, { forwardRef } from "react";
import { FieldError } from "@/types";
import { Input } from "../input";
import { Label } from "../label";
import ErrorMessage from "./ErrorMessage";

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  error?: FieldError;
}

export default forwardRef<HTMLInputElement, TextInputProps>(function FormInput(
  { label, error, required, ...props },
  ref
) {
  return (
    <>
      <Label className="mb-1 block capitalize">
        {label}
        {required ? <span className="text-primary">*</span> : null}
      </Label>
      <Input {...props} className={`${error ? "border-destructive text-destructive" : ""}`} ref={ref} />
      <ErrorMessage error={error} />
    </>
  );
});
