"use client";

import React from "react";
import { scan } from "react-scan";

scan({
  enabled: true
});

export default function ReactScan() {
  return <script async crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js" />;
}
