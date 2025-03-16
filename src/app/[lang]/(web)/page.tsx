import { IFullProduct, Pagination } from "@/types";
import HomePage from "@/components/pages/HomePage";
import axios from "@/lib/axios";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";

// Disable caching for this page
export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const getProducts = async (page = 1) => {
  noStore();
  const res = await axios.get<{ data: IFullProduct[]; pages: Pagination }>("/api/catalog/homefeed", {
    params: {
      page: page,
      limit: 10
    },
    headers: {
      Authorization: `Bearer ${(await cookies()).get("session")?.value}`,
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      Expires: "-1",
      cache: "no-store",
      Pragma: "no-cache"
    }
  });

  return res.data ?? [];
};

const queryClient = new QueryClient();

export default async function Page() {
  noStore();
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
