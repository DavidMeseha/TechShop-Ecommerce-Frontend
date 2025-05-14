import React from "react";
import StripeInit from "@/components/util/StripeInit";

export default function layout({ children }: { children: React.ReactNode }) {
  return <StripeInit>{children}</StripeInit>;
}
