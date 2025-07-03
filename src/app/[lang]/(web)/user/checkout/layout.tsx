import React from "react";
import StripeInit from "@/common/components/utils/StripeInit";

export default function layout({ children }: { children: React.ReactNode }) {
  return <StripeInit>{children}</StripeInit>;
}
