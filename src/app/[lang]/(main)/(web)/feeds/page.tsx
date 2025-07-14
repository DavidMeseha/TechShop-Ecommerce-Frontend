import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { FEED_QUERY_KEY, PRODUCTS_QUERY_KEY } from "@/common/constants/query-keys";
import FeedPage from "./FeedPage";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import { homeFeedProducts } from "@/web/services/catalog.service";

export default async function Page() {
  const queryClient = new QueryClient({});
  await configureServerRequest();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, FEED_QUERY_KEY],
    queryFn: ({ pageParam = 1 }) => homeFeedProducts({ page: pageParam, limit: 2 }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedPage />
    </HydrationBoundary>
  );
}
