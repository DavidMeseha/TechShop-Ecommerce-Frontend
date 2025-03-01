"use client";

import React from "react";
import { scan } from "react-scan";

scan({
  enabled: true,
  dangerouslyForceRunInProduction: true
});

export default function ReactScan({ children }: { children: React.ReactNode }) {
  return children;
}
