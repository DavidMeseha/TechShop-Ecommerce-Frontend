"use client";

import { LocalLink } from "@/components/util/LocalizedNavigation";
import React from "react";
import { BsHash } from "react-icons/bs";
import { ITag } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import { getTags } from "@/services/products.service";
import { DISCOVER_QUERY_KEY, TAGS_QUERY_KEY } from "@/constants/query-keys";

type ListItemProps = {
  tag: ITag;
  to: string;
};

export default function Page() {
  const { hasNextPage, fetchNextPage, isFetching, data, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [TAGS_QUERY_KEY, DISCOVER_QUERY_KEY],
    queryFn: ({ pageParam }) => getTags({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => (lastPage.pages.hasNext ? lastPage.pages.current + 1 : undefined),
    initialPageParam: 1
  });

  const tags = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <ul>
        <li className="hidden text-3xl font-bold md:inline-block">Tags</li>
        {tags.map((tag) => (
          <TagItem key={tag._id} tag={tag} to={`/tag/${tag.seName}`} />
        ))}
      </ul>

      {isFetching ? (
        <Loading />
      ) : hasNextPage ? (
        <div className="px-w py-4 text-center">
          <Button
            className="w-full bg-primary text-white"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      ) : null}
    </>
  );
}

function TagItem({ tag, to }: ListItemProps) {
  return (
    <li className="mx-2 my-2 inline-flex items-center rounded-full border px-4 py-2">
      <BsHash size={35} />
      <LocalLink className="text-sm font-bold" href={to}>
        <p>{tag.name}</p>
        <p className="w-max text-xs text-gray-400">{tag.productCount} products</p>
      </LocalLink>
    </li>
  );
}
