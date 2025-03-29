import * as React from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { IVendor } from "@/types";
import { LocalLink } from "./LocalizedNavigation";
import { useQuery } from "@tanstack/react-query";
import { getVendors } from "@/services/products.service";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Button from "./ui/Button";
import { useTranslation } from "@/context/Translation";
import VendorCardLoading from "./LoadingUi/VendorCardLoading";
import useFollow from "@/hooks/useFollow";

export function FeaturedVendors() {
  const [ref, inView] = useInView();
  const { isPending, data } = useQuery({
    queryKey: ["vendors", "featured"],
    queryFn: () => getVendors({ page: 1, limit: 10 }),
    enabled: inView
  });
  const vendors = data?.data ?? [];

  return (
    <Carousel className="w-full md:px-10" dir="ltr" opts={{ align: "start" }} ref={ref}>
      <div className="mx-auto w-20">
        <CarouselPrevious
          className="static start-0 border bg-transparent p-2 text-white hover:border-slate-500 disabled:opacity-50 md:absolute"
          variant="default"
        />
        <CarouselNext
          className="static end-0 ms-4 border bg-transparent p-2 text-white hover:border-slate-500 disabled:opacity-50 md:absolute"
          variant="default"
        />
      </div>
      <CarouselContent>
        {!isPending
          ? vendors.map((vendor) => (
              <CarouselItem className="basis-auto" key={vendor._id}>
                <VendorItem vendor={vendor} />
              </CarouselItem>
            ))
          : Array.from({ length: 8 }, (_, index) => (
              <CarouselItem className="basis-auto" key={index}>
                <VendorCardLoading />
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}

function VendorItem({ vendor }: { vendor: IVendor }) {
  const { t } = useTranslation();
  const followHandle = useFollow({ vendor });

  return (
    <div className="flex flex-col items-center rounded-md border px-2 py-4 text-center">
      <LocalLink className="" href={`/vendor/${vendor.seName}`}>
        <Image
          alt={vendor.name}
          className="w-h-24 h-24 rounded-full object-cover"
          height={110}
          priority={true}
          quality={85}
          src={vendor.imageUrl}
          width={110}
        />
        <p>{vendor.name}</p>
      </LocalLink>
      <Button
        className={`mt-4 w-max bg-primary text-xs text-primary-foreground ${vendor.isFollowed ? "bg-red-600" : "bg-primary"}`}
        onClick={() => followHandle(!vendor.isFollowed)}
      >
        {vendor.isFollowed ? t("unfollow") : t("follow")}
      </Button>
    </div>
  );
}
