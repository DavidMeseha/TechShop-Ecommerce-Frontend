"use client";

import Image from "next/image";
import { FeaturedTags } from "../../../components/FeaturedTags";
import SectionHeader from "@/components/SectionHeader";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FeaturedVendors } from "@/components/FeaturedVendors";
import MoreProducts from "@/components/MoreProducts";
import { useTranslation } from "@/context/Translation";

export default function Page() {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative">
        <h1
          className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center p-6 text-2xl font-bold text-primary-foreground sm:items-start sm:justify-start sm:text-start sm:text-5xl"
          dir="ltr"
        >
          <span>Tomorrow&apos;s Tech,</span>
          <span className="mt-2 block"> Today&apos;s Prices</span>
        </h1>
        <Image
          alt="Hero"
          className="mb-6 max-h-96 w-full object-cover object-left-top md:my-6 md:rounded-lg"
          height={1080}
          priority
          quality={85}
          sizes="100vw"
          src="/images/home-panner.jpg"
          width={1920}
        />
      </div>
      <div className="space-y-8 px-4 md:px-0">
        <section>
          <FeaturedTags />
        </section>
        <section>
          <SectionHeader title={t("featuredProducts")} />
          <FeaturedProducts />
        </section>
        <section>
          <SectionHeader title={t("topVendors")} />
          <FeaturedVendors />
        </section>
        <section>
          <SectionHeader title={t("moreProducts")} />
          <MoreProducts />
        </section>
      </div>
    </>
  );
}
