import CategoryProfilePage from "@/components/pages/CategoryProfilePage";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { PRODUCTS_QUERY_KEY, SINGLE_CATEGORY_QUERY_KEY } from "@/constants/query-keys";
import { categoriesToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

export const revalidate = 600;
export const dynamicParams = true;

const cachedCategoryInfo = cache(async (seName: string) => {
  const { getCategoryInfo } = await prefetchServerRepo();
  try {
    const category = await getCategoryInfo(seName);
    return category;
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  return await categoriesToGenerate();
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await params;
  try {
    const category = await cachedCategoryInfo(seName);
    const parentMeta = await parent;

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

const queryClient = new QueryClient({});

export default async function Page({ params }: Props) {
  const seName = (await params).seName;
  const { getProductsByCategory } = await prefetchServerRepo();
  const category = await cachedCategoryInfo(seName);

  await queryClient.prefetchInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, SINGLE_CATEGORY_QUERY_KEY, category.seName],
    queryFn: ({ pageParam }) => getProductsByCategory(category._id, { page: pageParam }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryProfilePage category={category} />;
    </HydrationBoundary>
  );
}
