import React, { ChangeEvent } from "react";
import Checkbox from "./ui/Checkbox";

type Props = {
  className?: string;
  title: string;
  values: string | string[];
  options: { name: string; value: string }[];
  onChange: (value: string[]) => void;
};

export default function CheckboxGroup({ values, options, title, onChange, className }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let tempValues = [];
    if (typeof values === "object") tempValues = [...values];
    else values && tempValues.push(values);

    if (e.currentTarget.checked) tempValues.push(e.currentTarget.value);
    else tempValues.splice(tempValues.indexOf(e.target.value), 1);

    onChange(tempValues);
  };

  return (
    <div className={className} data-testid="checkbox-group">
      <div className="mb-2 text-lg">{title}</div>
      <div className="flex flex-wrap gap-4">
        {options.map((option, index) => (
          <Checkbox
            checked={values.includes(option.value)}
            className="p-0"
            id={option.name}
            key={index}
            label={option.name}
            value={option.value}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}
