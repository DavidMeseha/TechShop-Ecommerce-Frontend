"use client";

import Image from "next/image";
import "@/globals.css";
import { useRouter } from "next/navigation";
import { Button } from "@/common/components/ui/button";

export default function GlobalError() {
  const router = useRouter();
  return (
    <html>
      <body style={{ padding: 0, textAlign: "center", font: "20px Helvetica, sans-serif", color: "#333" }}>
        <div
          style={{
            height: "95dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            alt="product not found"
            height={250}
            src="/images/web_application_crash_failure.webp"
            style={{ objectFit: "contain" }}
            width={250}
          />
          <h1 style={{ fontSize: "2.25rem", fontWeight: "700", color: "gray", textAlign: "center" }}>
            Somthing Wrong Happend
          </h1>
          <Button
            style={{
              color: "white",
              backgroundColor: "#FA2D6C",
              border: "none",
              fontSize: "1rem",
              padding: "9px 18px"
            }}
            onClick={() => router.push("/")}
          >
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
