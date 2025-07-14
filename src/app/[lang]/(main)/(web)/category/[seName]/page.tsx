import CategoryProfilePage from "../CategoryProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryInfo, getProductsByCateory } from "@/web/services/catalog.service";
import { PRODUCTS_QUERY_KEY, SINGLE_CATEGORY_QUERY_KEY } from "@/common/constants/query-keys";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = { params: Promise<{ seName: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await params;

  try {
    const [category, parentMeta] = await Promise.all([getCategoryInfo(seName), parent]);

    return {
      title: `${parentMeta.title?.absolute} | ${category.name}`,
      description: category.seName + " products" + category.productsCount,
      openGraph: {
        type: "website",
        title: `${parentMeta.title?.absolute} | ${category.name}`,
        description: category.seName + " products" + category.productsCount
      }
    };
  } catch {
    return { title: "Error" };
  }
}

export default async function Page({ params }: Props) {
  const { seName } = await params;
  const queryClient = new QueryClient();
  await configureServerRequest();

  try {
    const category = await getCategoryInfo(seName);

    await queryClient.prefetchInfiniteQuery({
      queryKey: [PRODUCTS_QUERY_KEY, SINGLE_CATEGORY_QUERY_KEY, seName],
      queryFn: ({ pageParam }) => getProductsByCateory(category._id, { page: pageParam }),
      initialPageParam: 1
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryProfilePage category={category} />
      </HydrationBoundary>
    );
  } catch {
    notFound();
  }
}
