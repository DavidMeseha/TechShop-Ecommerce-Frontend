"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/common/components/ui/carousel";
import ProductCard from "../ProductCard";
import { useQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/web/services/catalog.service";
import { useInView } from "react-intersection-observer";
import ProductCardLoading from "../loadingUi/ProductCardLoading";
import SectionHeader from "@/common/components/ui/extend/SectionHeader";
import { useTranslation } from "@/common/context/Translation";
import { FEATURED_QUERY_KEY, PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";

export function FeaturedProducts() {
  const [ref, inView] = useInView();
  const { t } = useTranslation();

  const { data, isPending } = useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, FEATURED_QUERY_KEY],
    queryFn: async () => homeFeedProducts({ page: 1, limit: 7 }),
    enabled: inView
  });
  const products = data?.data ?? [];

  return (
    <div>
      <SectionHeader title={t("featuredProducts")} />
      <Carousel className="w-full md:px-10" dir="ltr" opts={{ align: "start", watchDrag: false }} ref={ref}>
        <div className="mx-auto w-20">
          <CarouselPrevious className="static start-0 border md:absolute" variant="default" />
          <CarouselNext className="static end-0 ms-4 border md:absolute" variant="default" />
        </div>
        <CarouselContent className="items-stretch">
          {isPending
            ? Array.from({ length: 10 }, (_, index) => (
                <CarouselItem className="h-full basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5" key={index}>
                  <ProductCardLoading />
                </CarouselItem>
              ))
            : products.map((product) => (
                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5" key={product._id}>
                  <ProductCard canAddReview={false} className="h-full" product={product} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
