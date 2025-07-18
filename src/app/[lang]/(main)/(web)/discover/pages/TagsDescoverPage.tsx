"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import Loading from "@/common/components/loadingUi/LoadingSpinner";
import { DISCOVER_QUERY_KEY, TAGS_QUERY_KEY } from "@/common/constants/query-keys";
import { getTags } from "@/web/services/catalog.service";
import TagItem from "../components/TagItem";

export default function TagsDescoverPage() {
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
          <TagItem key={tag._id} tag={tag} />
        ))}
      </ul>

      {isFetching ? (
        <Loading />
      ) : hasNextPage ? (
        <div className="px-w py-4 text-center">
          <SubmitButton
            className="w-full bg-primary text-white"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Load More
          </SubmitButton>
        </div>
      ) : null}
    </>
  );
}
