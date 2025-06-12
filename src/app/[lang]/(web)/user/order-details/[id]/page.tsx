import OrderDetailsPage from "../OrderDetailsPage";
import { ORDERS_QUERY_KEY } from "@/constants/query-keys";
import { getOrder } from "@/services/user.service";
import createServerServices from "@/services/server/createServerService";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await createServerServices();

  await queryClient.prefetchQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => getOrder(id)
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderDetailsPage orderId={id} />;
    </HydrationBoundary>
  );
}
