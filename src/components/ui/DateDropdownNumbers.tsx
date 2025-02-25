"use client";
import { cn } from "@/lib/utils";
import Dropdown from "../DropDown";
import { HTMLProps, useMemo, useRef } from "react";

interface Props {
  className?: string;
  title: string;
  dayInputAttributes: HTMLProps<HTMLSelectElement>;
  monthInputAttributes: HTMLProps<HTMLSelectElement>;
  yearInputAttributes: HTMLProps<HTMLSelectElement>;
}

export default function DateDropdownNumbers({
  className,
  title,
  dayInputAttributes,
  monthInputAttributes,
  yearInputAttributes
}: Props) {
  const today = useRef(new Date());
  const days = useMemo(
    () =>
      Array.from(
        {
          length:
            monthInputAttributes.value === 2
              ? (parseInt(yearInputAttributes.value as string) ?? 2000) % 4 === 0
                ? 29
                : 28
              : (parseInt(monthInputAttributes.value as string) ?? 1) % 2 === 0
                ? 30
                : 31
        },
        (_, index) => ({ name: (index + 1).toString(), value: (index + 1).toString() })
      ),
    [monthInputAttributes.value, yearInputAttributes.value]
  );

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        name: (index + 1).toString(),
        value: (index + 1).toString()
      })),
    []
  );

  const years = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => ({
        name: (today.current.getFullYear() - index).toString(),
        value: (today.current.getFullYear() - index).toString()
      })),
    []
  );

  return (
    <>
      <div className="text-lg">{title}h</div>
      <div className={cn("flex w-full gap-4", className)}>
        <div className="w-1/4">
          <Dropdown dir="ltr" label="day" name="day" options={days} {...dayInputAttributes} />
        </div>
        <div className="w-1/4">
          <Dropdown dir="ltr" label="month" name="month" options={months} {...monthInputAttributes} />
        </div>
        <div className="w-2/4">
          <Dropdown dir="ltr" label="year" name="year" options={years} {...yearInputAttributes} />
        </div>
      </div>
    </>
  );
}
