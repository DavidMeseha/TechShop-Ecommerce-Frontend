"use client";

import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";

type Option = { value: string; label: string };

type Props = {
  className?: string;
  labelledBy: string;
  options: Option[];
  onSelectChange: (selected: Option[]) => void;
};

export default function MultiselectDropdown({ className, onSelectChange, labelledBy, options }: Props) {
  const [selected, setSelected] = useState<Option[]>([]);

  useEffect(() => {
    onSelectChange(selected);
  }, [selected]);

  return (
    <div className={`mb-4 ${className}`}>
      <label className="mb-1">{labelledBy}</label>
      <MultiSelect
        className="w-full rounded-md border-secondary peer-first:focus-within:border-primary peer-first:focus-within:ring-primary"
        labelledBy={labelledBy}
        options={options}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
}
