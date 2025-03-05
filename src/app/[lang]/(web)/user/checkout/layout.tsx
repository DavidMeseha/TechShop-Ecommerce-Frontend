import React from "react";
import StripeInit from "@/context/StripeInit";

export default function layout({ children }: { children: React.ReactNode }) {
  return <StripeInit>{children}</StripeInit>;
}
