import Link from "next/link";
import type { Metadata } from "next";
import { Ban } from "lucide-react";
import Logo from "@/common/components/Logo";
import { TranslationProvider } from "@/common/context/Translation";
import en from "@/common/dictionaries/en.json";

export const metadata: Metadata = {
  title: "404 - Page Not Found | MyShop",
  description: "Sorry, the page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: false }
};

export default function NotFound() {
  return (
    <html>
      <body>
        <TranslationProvider lang="en" translation={en}>
          <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <Logo className="mb-8 scale-110" />
            <div className="mb-8">
              <Ban aria-hidden="true" className="bg-white text-destructive" size={120} strokeWidth={1.5} />
            </div>
            <h1 className="mb-2 text-center text-6xl font-extrabold text-primary drop-shadow-lg">404</h1>
            <p className="mb-6 max-w-md text-center text-lg text-gray-500">
              Sorry, we couldn’t find that page.
              <br />
              It might have been removed, renamed, or did not exist in the first place.
            </p>
            <Link
              aria-label="Go back to homepage"
              className="hover:bg-primary/60 rounded bg-primary px-6 py-3 text-lg font-semibold text-white shadow transition"
              href="/"
            >
              Go Home
            </Link>
          </main>
        </TranslationProvider>
      </body>
    </html>
  );
}
