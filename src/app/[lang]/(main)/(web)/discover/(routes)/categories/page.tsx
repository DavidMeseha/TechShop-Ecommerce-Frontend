import CategoriesDiscoverPage from "../../pages/CategoriesDiscoverPage";
import { CATEGORIES_QUERY_KEY, DISCOVER_QUERY_KEY } from "@/common/constants/query-keys";
import { getCategories } from "@/web/services/catalog.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Page() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [CATEGORIES_QUERY_KEY, DISCOVER_QUERY_KEY],
    queryFn: ({ pageParam }) => getCategories({ page: pageParam }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesDiscoverPage />
    </HydrationBoundary>
  );
}
