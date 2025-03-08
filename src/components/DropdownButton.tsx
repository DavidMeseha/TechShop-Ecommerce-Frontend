import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RiArrowDropDownLine } from "react-icons/ri";
import useClickRecognition from "@/hooks/useClickRecognition";
import LoadingSpinner from "./LoadingUi/LoadingSpinner";

type DropdownProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  options: { name: string; value: string }[];
  children: React.ReactNode;
  isLoading?: boolean;
  onSelectItem: (selected: string) => void;
  className?: string;
  isHoverable?: boolean;
};

export default function DropdownButton({
  options,
  className,
  children,
  isLoading,
  onSelectItem,
  isHoverable,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(isHoverable);
  const containerRef = useRef(null);

  const close = () => {
    if (isHoverable) return;
    setIsOpen(false);
  };

  useClickRecognition({ onOutsideClick: close, containerRef });
  return (
    <button
      className={cn(`group relative flex w-full justify-between rounded-sm px-4 py-2`, className)}
      ref={containerRef}
      onClick={() => (isHoverable ? null : setIsOpen(!isOpen))}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div>{children}</div>
          <RiArrowDropDownLine size={25} />
        </>
      )}
      {isOpen ? (
        <ul
          className={`absolute start-0 top-10 z-30 w-44 rounded-md border bg-white text-start text-sm capitalize text-black ${isHoverable ? "hidden group-hover:block" : ""}`}
        >
          {options.map((option, index) => (
            <li
              className="hover:bg-lightGray cursor-pointer px-4 py-2"
              key={index}
              onClick={() => onSelectItem(option.value)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      ) : null}
    </button>
  );
}
