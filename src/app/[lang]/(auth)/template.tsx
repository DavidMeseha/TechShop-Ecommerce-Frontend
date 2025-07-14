import Logo from "@/common/components/Logo";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-8 rounded-xl border p-8 shadow-lg">
        <Logo className="justify-center" />
        {children}
      </div>
    </div>
  );
}
