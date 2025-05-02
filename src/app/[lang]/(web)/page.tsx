import Image from "next/image";
import { FeaturedTags } from "@/components/FeaturedTags";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FeaturedVendors } from "@/components/FeaturedVendors";
import MoreProducts from "@/components/MoreProducts";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { IFullProduct, Pagination } from "@/types";
import axios from "@/lib/axios";
import { cookies } from "next/headers";
import { getTags } from "@/services/products.service";
import { FEATURED_QUERY_KEY, PRODUCTS_QUERY_KEY, TAGS_QUERY_KEY } from "@/constants/query-keys";

const getProducts = async (page = 1) => {
  const res = await axios
    .get<{ data: IFullProduct[]; pages: Pagination }>("api/catalog/homefeed", {
      params: {
        page: page,
        limit: 7
      },
      headers: {
        Authorization: `Bearer ${(await cookies()).get("session")?.value}`
      }
    })
    .catch(() => ({ data: { data: [], pages: { current: 0, limit: 0, hasNext: false } } }));

  return res.data ?? [];
};

const queryClient = new QueryClient({});

export default async function Page() {
  await queryClient.prefetchQuery({
    queryKey: [PRODUCTS_QUERY_KEY, FEATURED_QUERY_KEY],
    queryFn: () => getProducts()
  });

  await queryClient.prefetchQuery({
    queryKey: [TAGS_QUERY_KEY, FEATURED_QUERY_KEY],
    queryFn: () => getTags({ page: 1, limit: 10 })
  });

  return (
    <>
      <div className="relative">
        <h1
          className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center p-6 text-2xl font-bold text-primary-foreground sm:items-start sm:justify-start sm:text-start sm:text-5xl"
          dir="ltr"
        >
          <span>Tomorrow&apos;s Tech,</span>
          <span className="mt-2 block"> Today&apos;s Prices</span>
        </h1>
        <Image
          alt="Hero"
          className="mb-6 max-h-96 w-full object-cover object-left-top md:my-6 md:rounded-lg"
          height={1080}
          priority
          quality={85}
          sizes="100vw"
          src="/images/home-panner.jpg"
          width={1920}
        />
      </div>
      <div className="space-y-8 px-4 md:px-0">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section>
            <FeaturedTags />
          </section>
          <section>
            <FeaturedProducts />
          </section>
        </HydrationBoundary>
        <section>
          <FeaturedVendors />
        </section>
        <section>
          <MoreProducts />
        </section>
      </div>
    </>
  );
}
