"use client";

import Image from "next/image";
import { FeaturedTags } from "../../../components/FeaturedTags";
import SectionHeader from "@/components/SectionHeader";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FeaturedVendors } from "@/components/FeaturedVendors";
import MoreProducts from "@/components/MoreProducts";

export default function Page() {
  return (
    <>
      <div className="relative">
        <h1 className="absolute left-0 top-0 z-50 p-6 text-5xl font-bold text-primary-foreground">
          <span>Tomorrow&apos;s Tech,</span>
          <span className="block mt-2"> Today&apos;s Prices</span>
        </h1>
        <Image
          alt="Hero"
          className="my-6 max-h-96 w-full rounded-lg object-cover object-left-top"
          height={1080}
          priority
          quality={100}
          src="/images/home-panner.jpg"
          width={1920}
        />
      </div>
      <div className="space-y-6">
        <FeaturedTags />
        <section className="py-2">
          <SectionHeader title="Featured Products" />
          <FeaturedProducts />
        </section>
        <section className="pt-2">
          <SectionHeader title={"Top Vendors"} />
          <FeaturedVendors />
        </section>
        <section className="relative border-b py-2">
          <SectionHeader title={"More Products"} />
          <MoreProducts />
        </section>
      </div>
    </>
  );
}
