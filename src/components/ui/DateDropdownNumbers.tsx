"use client";
import { cn } from "@/lib/utils";
import Dropdown from "../DropDown";

const today = new Date();

const months = Array.from({ length: 12 }, (_, index) => ({
  name: (index + 1).toString(),
  value: (index + 1).toString()
}));

const years = Array.from({ length: 100 }, (_, index) => ({
  name: (today.getFullYear() - index).toString(),
  value: (today.getFullYear() - index).toString()
}));

export default function DateDropdownNumbers({
  day,
  month,
  year,
  changeDay,
  changeMonth,
  changeYear,
  className,
  title
}: {
  day?: number;
  month?: number;
  year?: number;
  changeDay?: (value: number) => void;
  changeMonth?: (value: number) => void;
  changeYear?: (value: number) => void;
  className?: string;
  title: string;
}) {
  const days = Array.from(
    { length: month === 2 ? ((year ?? 2024) % 4 === 0 ? 29 : 28) : (month ?? 1) % 2 === 0 ? 30 : 31 },
    (_, index) => ({ name: (index + 1).toString(), value: (index + 1).toString() })
  );
  return (
    <>
      <div className="text-lg">{title}h</div>
      <div className={cn("flex w-full gap-4", className)}>
        <div className="w-1/4">
          <Dropdown
            dir="ltr"
            label="day"
            name="day"
            options={days}
            value={day}
            onChange={(e) => changeDay && changeDay(parseInt(e.target.value))}
          />
        </div>
        <div className="w-1/4">
          <Dropdown
            dir="ltr"
            label="month"
            name="month"
            options={months}
            value={month}
            onChange={(e) => changeMonth && changeMonth(parseInt(e.target.value))}
          />
        </div>
        <div className="w-2/4">
          <Dropdown
            dir="ltr"
            label="year"
            name="year"
            options={years}
            value={year}
            onChange={(e) => changeYear && changeYear(parseInt(e.target.value))}
          />
        </div>
      </div>
    </>
  );
}
