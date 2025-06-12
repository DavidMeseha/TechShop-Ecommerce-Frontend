import { ORDERS_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { getOrders } from "@/services/user.service";
import createServerServices from "@/services/server/createServerService";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import OrdersPage from "./OrdersPage";

export default async function Page() {
  const queryClient = new QueryClient();
  await createServerServices();

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
