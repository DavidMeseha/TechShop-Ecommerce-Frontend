import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import createServerService from "@/services/server/createServerService";
import { getUserReviews } from "@/services/user.service";
import ReviewsPage from "./ReviewsPage";
import { REVIEWS_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";

export default async function Page() {
  const queryClient = new QueryClient();
  await createServerService();

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
