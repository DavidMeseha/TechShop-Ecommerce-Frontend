"use client";

import Image from "next/image";
import { useRouter } from "@bprogress/next";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);
  return (
    <html>
      <body>
        <div className="mt-28 flex flex-col items-center justify-center">
          <Image
            alt="not found"
            className="object-contain contrast-0 filter"
            height={400}
            priority={true}
            src="/images/product-not-found.png"
            width={400}
          />
          <h1 className="text-center text-4xl font-bold text-gray-400">404: Resource Not Found</h1>
          <p className="mt-4 text-center text-primary hover:underline">Redirecting...</p>
        </div>
      </body>
    </html>
  );
}
