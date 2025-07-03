"use client";

import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../label";

interface Props<T extends string> extends React.HTMLProps<HTMLInputElement> {
  title: string;
  options: { name: string | React.ReactNode; value: string }[];
  checkedValue?: string;
  zodRegister?: UseFormRegisterReturn<T>;
}

export default function RadioGroup<T extends string>({
  options,
  title,
  className,
  checkedValue,
  zodRegister,
  ...props
}: Props<T>) {
  return (
    <div className={className} data-testid="radio-group">
      <Label>{title}</Label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label className="mb-2" htmlFor={option.value} key={option.value}>
            {zodRegister ? (
              <input
                {...zodRegister}
                className="me-2 border-primary-300 bg-primary-100 text-primary focus:ring-primary-100"
                id={option.value}
                type="radio"
                value={option.value}
              />
            ) : (
              <input
                {...props}
                checked={checkedValue === option.value}
                className="me-2 border-primary-300 bg-primary-100 text-primary focus:ring-primary-100"
                id={option.value}
                type="radio"
                value={option.value}
              />
            )}
            {option.name}
          </label>
        ))}
      </div>
    </div>
  );
}
