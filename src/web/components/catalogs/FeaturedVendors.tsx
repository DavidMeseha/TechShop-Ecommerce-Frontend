"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/common/components/ui/carousel";
import { IVendor } from "@/types";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { useQuery } from "@tanstack/react-query";
import { getVendors } from "@/web/services/catalog.service";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useTranslation } from "@/common/context/Translation";
import VendorCardLoading from "../loadingUi/VendorCardLoading";
import useFollow from "@/web/features/follow-vendor/useFollow";
import SectionHeader from "@/common/components/ui/extend/SectionHeader";
import { FEATURED_QUERY_KEY, VENDORS_QUERY_KEY } from "@/common/constants/query-keys";

export function FeaturedVendors() {
  const [ref, inView] = useInView();
  const { t } = useTranslation();

  const { isPending, data } = useQuery({
    queryKey: [VENDORS_QUERY_KEY, FEATURED_QUERY_KEY],
    queryFn: () => getVendors({ page: 1, limit: 10 }),
    enabled: inView
  });
  const vendors = data?.data ?? [];

  return (
    <>
      <SectionHeader title={t("topVendors")} />

      <Carousel className="w-full md:px-10" dir="ltr" opts={{ align: "start" }} ref={ref}>
        <div className="mx-auto w-20">
          <CarouselPrevious className="static start-0 p-2 md:absolute" variant="default" />
          <CarouselNext className="static end-0 ms-4 p-2 md:absolute" variant="default" />
        </div>
        <CarouselContent>
          {!isPending
            ? vendors.map((vendor) => (
                <CarouselItem className="basis-auto" key={vendor._id}>
                  <MemoizedVendorItem vendor={vendor} />
                </CarouselItem>
              ))
            : Array.from({ length: 8 }, (_, index) => (
                <CarouselItem className="basis-auto" key={index}>
                  <VendorCardLoading />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}

function VendorItem({ vendor }: { vendor: IVendor }) {
  const { t } = useTranslation();
  const followHandle = useFollow({ vendor });

  return (
    <div className="flex w-40 flex-col items-center rounded-md border px-2 py-4 text-center">
      <LocalLink className="" href={`/vendor/${vendor.seName}`}>
        <Image
          alt={vendor.name}
          className="mx-auto h-28 w-28 rounded-full object-cover"
          height={110}
          priority={true}
          quality={85}
          src={vendor.imageUrl}
          width={110}
        />
        <p>{vendor.name}</p>
      </LocalLink>
      <SubmitButton
        className={`mt-4 w-max bg-primary text-xs text-primary-foreground ${vendor.isFollowed ? "bg-red-600 hover:bg-red-500" : ""}`}
        onClick={() => followHandle(!vendor.isFollowed)}
      >
        {vendor.isFollowed ? t("unfollow") : t("follow")}
      </SubmitButton>
    </div>
  );
}

const MemoizedVendorItem = React.memo(VendorItem, (prevProps, nextProps) => {
  return prevProps.vendor._id === nextProps.vendor._id && prevProps.vendor.isFollowed === nextProps.vendor.isFollowed;
});
