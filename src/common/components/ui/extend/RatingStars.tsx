"use client";

import React, { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type Props = {
  rate: number;
  onChange?: (value: number) => void;
  isEditable?: boolean;
  className?: string;
  size?: number;
};

export default function RatingStars({ rate, onChange, isEditable = false, className = "", size = 20 }: Props) {
  const [tempRate, setTempRate] = useState(rate);

  const mouseEnterHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditable) return;
    const target = e.target as HTMLDivElement;
    target.id && setTempRate(parseInt(target.id));
  };

  useEffect(() => {
    setTempRate(rate);
  }, [rate]);

  return (
    <div
      className={twMerge(clsx(["flex gap-1", className]))}
      onMouseLeave={() => isEditable && setTempRate(rate)}
      onMouseMove={mouseEnterHandle}
    >
      <div className={isEditable ? "cursor-pointer" : ""} onClick={() => onChange && onChange(1)}>
        {tempRate >= 1 ? (
          <BsStarFill className="fill-yellow-600" id="1" size={size} />
        ) : (
          <BsStar className="fill-yellow-600" id="1" size={size} />
        )}
      </div>
      <div className={isEditable ? "cursor-pointer" : ""} onClick={() => onChange && onChange(2)}>
        {tempRate >= 2 ? (
          <BsStarFill className="fill-yellow-600" id="2" size={size} />
        ) : (
          <BsStar className="fill-yellow-600" id="2" size={size} />
        )}
      </div>
      <div className={isEditable ? "cursor-pointer" : ""} onClick={() => onChange && onChange(3)}>
        {tempRate >= 3 ? (
          <BsStarFill className="fill-yellow-600" id="3" size={size} />
        ) : (
          <BsStar className="fill-yellow-600" id="3" size={size} />
        )}
      </div>
      <div className={isEditable ? "cursor-pointer" : ""} onClick={() => onChange && onChange(4)}>
        {tempRate >= 4 ? (
          <BsStarFill className="fill-yellow-600" id="4" size={size} />
        ) : (
          <BsStar className="fill-yellow-600" id="4" size={size} />
        )}
      </div>
      <div className={isEditable ? "cursor-pointer" : ""} onClick={() => onChange && onChange(5)}>
        {tempRate >= 5 ? (
          <BsStarFill className="fill-yellow-600" id="5" size={size} />
        ) : (
          <BsStar className="fill-yellow-600" id="5" size={size} />
        )}
      </div>
    </div>
  );
}
