import * as React from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "./product/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/products.service";
import { useInView } from "react-intersection-observer";
import ProductCardLoading from "./LoadingUi/ProductCardLoading";

export function FeaturedProducts() {
  const [ref, inView] = useInView();

  const { data, isPending } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => homeFeedProducts({ page: 1, limit: 7 }),
    enabled: inView
  });
  const products = data?.data ?? [];

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
  );
}
