import createServerServices from "@/services/server/createServerService";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { INFO_QUERY_KEY, USER_QUERY_KEY } from "@/constants/query-keys";
import { getUserInfo } from "@/services/user.service";
import ProfilePage from "./ProfilePage";

export default async function Page() {
  const queryClient = new QueryClient();
  await createServerServices();

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
