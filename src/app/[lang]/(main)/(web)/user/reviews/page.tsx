import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import { getUserReviews } from "@/web/services/user.service";
import ReviewsPage from "./ReviewsPage";
import { REVIEWS_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";

export default async function Page() {
  const queryClient = new QueryClient();
  await configureServerRequest();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [USER_QUERY_KEY, REVIEWS_QUERY_KEY],
    queryFn: ({ pageParam }) => getUserReviews({ page: pageParam }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewsPage />
    </HydrationBoundary>
  );
}
