/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
"use client";

import { useEffect } from "react";

export default function RequestDebugger() {
  useEffect(() => {
    const debugFetch = async () => {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const [url, config] = args;
        console.log("🚀 Request:", {
          url,
          method: config?.method || "GET",
          headers: config?.headers
        });

        try {
          const response = await originalFetch(...args);
          const clone = response.clone();

          console.log("📥 Response:", {
            url,
            status: response.status,
            headers: Object.fromEntries(response.headers)
          });

          // Try to read response body if possible
          clone
            .text()
            .then((text) => {
              try {
                const json = JSON.parse(text);
                console.log("Response body:", json);
              } catch {
                if (text.includes("_rsc")) {
                  console.log("RSC response detected");
                } else {
                  console.log("Raw response:", text.substring(0, 200));
                }
              }
            })
            .catch(() => console.log("Could not read response body"));

          return response;
        } catch (error) {
          console.error("❌ Request failed:", error);
          throw error;
        }
      };
    };

    debugFetch();
  }, []);

  return null;
}
