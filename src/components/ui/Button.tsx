import clsx from "clsx";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { twMerge } from "tailwind-merge";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  isLoading?: boolean;
  spinnerSize?: number | string;
};

export default function Button({ className, isLoading, spinnerSize = 24, ...props }: Props) {
  return (
    <button
      {...props}
      className={twMerge(clsx(["relative rounded-sm fill-white px-4 py-2", className]))}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex w-full items-center justify-center rounded-md bg-inherit">
          <BiLoaderCircle className="animate-spin fill-inherit" size={spinnerSize} />
        </div>
      ) : null}
      <div className="rounded-sm2">{props.children}</div>
    </button>
  );
}
