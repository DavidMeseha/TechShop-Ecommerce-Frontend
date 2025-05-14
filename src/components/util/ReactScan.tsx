"use client";

import React, { useEffect } from "react";
import { scan } from "react-scan";

export default function ReactScan() {
  useEffect(() => {
    try {
      scan({
        enabled: false,
        dangerouslyForceRunInProduction: false
      });
    } catch {
      return;
    }
  }, []);
  return <script async crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />;
}
