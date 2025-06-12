import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
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
          <Link className="bg-primary px-4 py-2 text-white" href="/">
            Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
