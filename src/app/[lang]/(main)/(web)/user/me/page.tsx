import configureServerRequests from "@/common/services/server/configureServerRequest";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { INFO_QUERY_KEY, USER_QUERY_KEY } from "@/common/constants/query-keys";
import { getUserInfo } from "@/web/services/user.service";
import ProfilePage from "./ProfilePage";

export default async function Page() {
  const queryClient = new QueryClient();
  await configureServerRequests();

  await queryClient.prefetchQuery({
    queryKey: [USER_QUERY_KEY, INFO_QUERY_KEY],
    queryFn: () => getUserInfo()
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePage />
    </HydrationBoundary>
  );
}
