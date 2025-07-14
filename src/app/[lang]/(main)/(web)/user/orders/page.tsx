import { ORDERS_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import { getOrders } from "@/web/services/user.service";
import configureServerRequests from "@/common/services/server/configureServerRequest";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import OrdersPage from "./OrdersPage";

export default async function Page() {
  const queryClient = new QueryClient();
  await configureServerRequests();

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY, ORDERS_QUERY_KEY],
    queryFn: () => getOrders()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersPage />
    </HydrationBoundary>
  );
}
