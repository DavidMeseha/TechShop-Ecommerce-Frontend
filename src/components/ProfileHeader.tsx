import BackArrow from "@/components/ui/BackArrow";
import { useRouter } from "@bprogress/next";
import React from "react";

type Props = {
  title: string;
};

export default function ProfilePagesHeader({ title }: Props) {
  const router = useRouter();

  return (
    <div className="fixed end-0 start-0 top-0 z-20 w-full border bg-white px-2 md:hidden">
      <div className="flex justify-between py-2">
        <BackArrow onClick={() => router.back()} />
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="w-6" />
      </div>
    </div>
  );
}
