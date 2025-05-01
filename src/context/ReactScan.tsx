"use client";

import React, { useEffect } from "react";
import { scan } from "react-scan";

export default function ReactScan() {
  useEffect(() => {
    scan({
      enabled: true
    });
  }, []);
  return <script async crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />;
}
