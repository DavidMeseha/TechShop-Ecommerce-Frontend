"use client";

import { LocalLink } from "@/components/LocalizedNavigation";
import React from "react";
import { BsHash } from "react-icons/bs";
import { ITag } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Loading from "@/components/LoadingUi/LoadingSpinner";
import { getTags } from "@/services/products.service";

type ListItemProps = {
  tag: ITag;
  to: string;
};

export default function Page() {
  const tagsQuery = useInfiniteQuery({
    queryKey: ["tagsDiscover"],
    queryFn: ({ pageParam }) => getTags({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      return lastPageParam + 1;
    }
  });

  const tagsPages = tagsQuery.data?.pages ?? [];
  const lastPage = tagsPages?.findLast((page) => page);

  return (
    <div className="mt-10 p-4 md:mt-0">
      <ul>
        <li className="hidden text-3xl font-bold md:inline-block">Tags</li>
        {tagsPages.map((page) =>
          page.data.map((tag) => <ListItem key={tag._id} tag={tag} to={`/profile/tag/${tag.seName}`} />)
        )}

        {tagsQuery.isFetching ? (
          <Loading />
        ) : lastPage && lastPage.pages.hasNext ? (
          <div className="px-w py-4 text-center">
            <Button
              className="w-full bg-primary text-white"
              isLoading={tagsQuery.isFetchingNextPage}
              onClick={() => tagsQuery.fetchNextPage()}
            >
              Load More
            </Button>
          </div>
        ) : null}
      </ul>
    </div>
  );
}

function ListItem({ tag, to }: ListItemProps) {
  return (
    <li className="mx-2 my-2 inline-flex items-center rounded-full border px-4 py-2">
      <BsHash size={35} />
      <LocalLink className="text-sm font-bold" href={to}>
        <p>{tag.name}</p>
        <p className="w-max text-xs text-secondary">{tag.productCount} products</p>
      </LocalLink>
    </li>
  );
}
