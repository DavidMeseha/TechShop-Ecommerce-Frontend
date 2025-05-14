"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ITag } from "@/types";
import { BsHash } from "react-icons/bs";
import { LocalLink } from "./util/LocalizedNavigation";
import { useQuery } from "@tanstack/react-query";
import { getTags } from "@/services/products.service";
import TagItemLoading from "./LoadingUi/TagItemLoading";
import { useInView } from "react-intersection-observer";
import { FEATURED_QUERY_KEY, TAGS_QUERY_KEY } from "@/constants/query-keys";

type ListItemProps = {
  tag: ITag;
};

export function FeaturedTags() {
  const [ref, inView] = useInView();

  const { isPending, data } = useQuery({
    queryKey: [TAGS_QUERY_KEY, FEATURED_QUERY_KEY],
    queryFn: () => getTags({ page: 1, limit: 10 }),
    enabled: inView
  });
  const tags = data?.data ?? [];

  return (
    <Carousel className="w-full px-10" dir="ltr" opts={{ align: "start" }} ref={ref}>
      <CarouselContent>
        {!isPending
          ? tags.map((tag) => (
              <CarouselItem className="basis-auto" key={tag._id}>
                <div className="p-1">
                  <TagItem tag={tag} />
                </div>
              </CarouselItem>
            ))
          : Array.from({ length: 8 }, (_, index) => (
              <CarouselItem className="basis-auto" key={index}>
                <TagItemLoading />
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

function TagItem({ tag }: ListItemProps) {
  return (
    <LocalLink
      className="flex items-center rounded-full border px-4 py-2 transition-colors hover:bg-slate-100"
      href={`/tag/${tag.seName}`}
    >
      <BsHash size={35} />
      <div className="text-sm font-bold">
        <p>{tag.name}</p>
        <p className="w-max text-xs text-gray-400">{tag.productCount} products</p>
      </div>
    </LocalLink>
  );
}
