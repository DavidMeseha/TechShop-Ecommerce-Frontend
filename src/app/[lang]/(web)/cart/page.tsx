import CheckoutCartPage from "./CheckoutCartPage";
import { CART_QUERY_KEY, CHECKOUT_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { checkoutData } from "@/services/checkout.service";
import configureServerRequests from "@/services/server/configureServerRequest";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();
  await configureServerRequests();

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY, CART_QUERY_KEY, CHECKOUT_QUERY_KEY],
    queryFn: () => checkoutData()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CheckoutCartPage />;
    </HydrationBoundary>
  );
}
