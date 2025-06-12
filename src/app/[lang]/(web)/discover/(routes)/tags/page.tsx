import TagsDescoverPage from "../../pages/TagsDescoverPage";
import { DISCOVER_QUERY_KEY, TAGS_QUERY_KEY } from "@/constants/query-keys";
import { getTags } from "@/services/catalog.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [TAGS_QUERY_KEY, DISCOVER_QUERY_KEY],
    queryFn: ({ pageParam }) => getTags({ page: pageParam, limit: 10 }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagsDescoverPage />;
    </HydrationBoundary>
  );
}
