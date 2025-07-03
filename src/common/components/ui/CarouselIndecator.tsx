import React from "react";

type Props = {
  className?: string;
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
  array: any[];
};

export default function CarouselIndecator({ array, className, setSelectedIndex, selectedIndex }: Props) {
  return (
    array.length > 1 && (
      <div className={`flex w-full justify-center gap-3 ${className ?? ""}`} dir="ltr">
        {array.map((_, index) => (
          <button
            aria-label="PickImage"
            className={`h-3 w-3 rounded-full transition-colors ${index == selectedIndex ? "bg-primary" : "bg-gray-200"}`}
            key={index}
            onClick={() => setSelectedIndex(index)}
          ></button>
        ))}
      </div>
    )
  );
}
