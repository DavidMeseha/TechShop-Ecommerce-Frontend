import TagProfilePage from "@/components/pages/TagProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cache } from "react";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { PRODUCTS_QUERY_KEY, SINGLE_TAG_QUERY_KEY } from "@/constants/query-keys";
import { tagsToGenerate } from "@/services/staticGeneration.service";

export const revalidate = 600;
export const dynamicParams = true;

type Props = { params: Promise<{ seName: string }> };

const cachedTagInfo = cache(async (seName: string) => {
  const { getTagInfo } = await prefetchServerRepo();
  try {
    const tag = await getTagInfo(seName);
    return tag;
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  return await tagsToGenerate();
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;
  try {
    const tag = await cachedTagInfo(seName);
    const parentMeta = await parent;

    return {
      title: `${parentMeta.title?.absolute} | #${tag.name}`,
      description: tag.seName + " " + tag.productCount,
      openGraph: {
        type: "website",
        title: `${parentMeta.title?.absolute} | #${tag.name}`,
        description: tag.seName + " " + tag.productCount
      }
    };
  } catch {
    return { title: "Not Found" };
  }
}

const queryClient = new QueryClient({});

export default async function Page(props: Props) {
  const seName = (await props.params).seName;
  const { getProductsByTag } = await prefetchServerRepo();
  const tag = await cachedTagInfo(seName);

  await queryClient.prefetchInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, SINGLE_TAG_QUERY_KEY, tag.seName],
    queryFn: ({ pageParam }) => getProductsByTag(tag._id, { page: pageParam }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TagProfilePage tag={tag} />;
    </HydrationBoundary>
  );
}
