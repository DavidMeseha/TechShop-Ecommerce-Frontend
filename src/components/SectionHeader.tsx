import React from "react";

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return (
    <h2 className="mb-6 flex w-full items-center gap-4 text-center text-2xl font-bold">
      <hr className="w-full" />
      <span className="whitespace-nowrap">{title}</span>
      <hr className="w-full" />
    </h2>
  );
}
