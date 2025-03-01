import { IFullProduct, Pagination } from "@/types";
import InfiniteFeed from "./InfiniteFeed";
import { cookies } from "next/headers";
import axios from "@/lib/axios";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();

  const getProducts = async (page = 1) => {
    const res = await axios
      .get<{ data: IFullProduct[]; pages: Pagination }>("api/catalog/homefeed", {
        params: {
          page: page
        },
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`
        }
      })
      .catch(() => ({ data: { data: [], pages: { current: 0, limit: 0, hasNext: false } } }));

    return res.data;
  };

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
