"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

type Props = { children: React.ReactNode };
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIP_KEY ?? "");

export default function StripeInit({ children }: Props) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
