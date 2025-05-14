import InfiniteFeed from "@/components/pages/FeedsPage";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { FEED_QUERY_KEY, PRODUCTS_QUERY_KEY } from "@/constants/query-keys";
import prefetchServerRepo from "@/services/prefetchServerRepo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const { getFeedProducts } = await prefetchServerRepo();

  const queryClient = new QueryClient({});

  await queryClient.prefetchInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, FEED_QUERY_KEY],
    queryFn: ({ pageParam = 1 }) => getFeedProducts({ page: pageParam, limit: 2 }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteFeed />
    </HydrationBoundary>
  );
}
