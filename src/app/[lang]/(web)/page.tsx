import { IFullProduct, Pagination } from "@/types";
import HomePage from "./HomePage";
import axios from "@/lib/axios";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();

  const getProducts = async (page = 1) => {
    const res = await axios.get<{ data: IFullProduct[]; pages: Pagination }>("api/catalog/homefeed", {
      params: {
        page: page,
        limit: 5
      }
    });

    return res.data ?? [];
  };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["homeProducts"],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />;
    </HydrationBoundary>
  );
}
