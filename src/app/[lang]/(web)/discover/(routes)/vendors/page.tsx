import VendorsDiscoverPage from "../../pages/VendorsDiscoverPage";
import { DISCOVER_QUERY_KEY, VENDORS_QUERY_KEY } from "@/constants/query-keys";
import { getVendors } from "@/services/catalog.service";
import configureServerRequests from "@/services/server/configureServerRequest";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();
  await configureServerRequests();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [VENDORS_QUERY_KEY, DISCOVER_QUERY_KEY],
    queryFn: ({ pageParam }) => getVendors({ page: pageParam, limit: 10 }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VendorsDiscoverPage />
    </HydrationBoundary>
  );
}
