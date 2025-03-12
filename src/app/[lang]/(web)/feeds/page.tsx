import { IFullProduct, Pagination } from "@/types";
import InfiniteFeed from "@/components/pages/FeedsPage";
import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const getProducts = async (page = 1) => {
  const res = await axios
    .get<{ data: IFullProduct[]; pages: Pagination }>("api/catalog/homefeed", {
      params: {
        page: page,
        limit: 2
      },
      headers: {
        Authorization: `Bearer ${(await cookies()).get("session")?.value}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        cache: false
      }
    })
    .catch(() => ({ data: { data: [], pages: { current: 0, limit: 0, hasNext: false } } }));

  return res.data ?? [];
};

const queryClient = new QueryClient();

export default async function Page() {
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["feedProducts"],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteFeed />
    </HydrationBoundary>
  );
}
