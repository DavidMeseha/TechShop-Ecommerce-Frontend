import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickRecognition from "@/hooks/useClickRecognition";

type DropdownProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  options: string[];
  children: React.ReactNode;
  isLoading?: boolean;
  onSelectItem: (selected: string) => void;
  className?: string;
};

export default function DropdownButton({
  options,
  className,
  children,
  isLoading,
  onSelectItem,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useClickRecognition({ onOutsideClick: () => setIsOpen(false), containerRef });
  return (
    <button
      className={cn(`relative flex w-full justify-between rounded-sm px-4 py-2`, className)}
      ref={containerRef}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {isLoading ? (
        <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} />
      ) : (
        <>
          <div>{children}</div>
          <RiArrowDropDownLine size={25} />
        </>
      )}
      {isOpen ? (
        <div className="absolute start-0 top-12 z-30 w-44 rounded-md border bg-white">
          <ul className="text-start text-sm capitalize text-black">
            {options.map((option, index) => (
              <li
                className="hover:bg-lightGray cursor-pointer px-4 py-2"
                key={index}
                onClick={() => onSelectItem(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </button>
  );
}
