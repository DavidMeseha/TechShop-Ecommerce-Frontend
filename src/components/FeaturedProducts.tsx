import * as React from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Card from "./product/Card";
import { useQuery } from "@tanstack/react-query";
import { homeFeedProducts } from "@/services/products.service";
import { useInView } from "react-intersection-observer";
import ProductCardLoading from "./LoadingUi/ProductCardLoading";

export function FeaturedProducts() {
  const [ref, inView] = useInView();

  const { data, isPending } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => homeFeedProducts({ page: 2, limit: 7 }),
    enabled: inView
  });
  const products = data?.data ?? [];

  return (
    <Carousel className="w-full px-10" opts={{ align: "start" }} ref={ref}>
      <CarouselContent>
        {isPending
          ? Array.from({ length: 10 }, (_, index) => (
              <CarouselItem className="h-full basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5" key={index}>
                <ProductCardLoading />
              </CarouselItem>
            ))
          : products.map((product) => (
              <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5" key={product._id}>
                <Card canAddReview={false} product={product} />
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious
        className="start-0 border bg-transparent p-2 text-white hover:border-slate-500 disabled:opacity-50"
        variant="default"
      />
      <CarouselNext
        className="end-0 border bg-transparent p-2 text-white hover:border-slate-500 disabled:opacity-50"
        variant="default"
      />
    </Carousel>
  );
}
