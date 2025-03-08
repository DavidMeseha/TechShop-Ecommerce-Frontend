"use client";

import React from "react";
import { scan } from "react-scan";

scan({
  enabled: true,
  dangerouslyForceRunInProduction: true,
  trackUnnecessaryRenders: true,
  _debug: "verbose"
});

export default function ReactScan({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script async crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />
      {children}
    </>
  );
}
