import { IFullProduct, Pagination } from "@/types";
import HomePage from "@/components/pages/HomePage";
import axios from "@/lib/axios";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

const getProducts = async (page = 1) => {
  const res = await axios.get<{ data: IFullProduct[]; pages: Pagination }>("/api/catalog/homefeed", {
    params: {
      page: page,
      limit: 10
    },
    headers: {
      Authorization: `Bearer ${(await cookies()).get("session")?.value}`
    }
  });

  return res.data ?? [];
};

const queryClient = new QueryClient();

export default async function Page() {
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["homeProducts"],
    queryFn: ({ pageParam = 1 }) => getProducts(pageParam),
    initialPageParam: 1,
    staleTime: 0,
    gcTime: 0
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePage />
    </HydrationBoundary>
  );
}
