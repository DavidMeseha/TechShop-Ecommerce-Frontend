import AdressesPage from "../pages/AdressesPage";
import configureServerRequests from "@/services/server/configureServerRequest";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { ADDRESSES_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { userAdresses } from "@/services/user.service";

export default async function page() {
  const queryClient = new QueryClient();
  await configureServerRequests();

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY, ADDRESSES_QUERY_KEY],
    queryFn: () => userAdresses()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdressesPage />
    </HydrationBoundary>
  );
}
