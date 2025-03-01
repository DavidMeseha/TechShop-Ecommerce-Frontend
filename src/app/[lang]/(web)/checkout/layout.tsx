import StripeInit from "@/context/StripeInit";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <StripeInit>{children}</StripeInit>;
}
