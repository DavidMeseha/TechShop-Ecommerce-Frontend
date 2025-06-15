import TagProfilePage from "@/app/[lang]/(web)/tag/TagProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByTag, getTagInfo } from "@/services/catalog.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import configureServerRequest from "@/services/server/configureServerRequest";
import { PRODUCTS_QUERY_KEY, SINGLE_TAG_QUERY_KEY } from "@/constants/query-keys";

type Props = { params: Promise<{ seName: string }> };

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;

  try {
    const [tag, parentMeta] = await Promise.all([getTagInfo(seName), parent]);

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

export default async function Page(props: Props) {
  const { seName } = await props.params;
  const queryClient = new QueryClient();
  await configureServerRequest();

  try {
    const tag = await getTagInfo(seName);

    await queryClient.prefetchInfiniteQuery({
      queryKey: [PRODUCTS_QUERY_KEY, SINGLE_TAG_QUERY_KEY, seName],
      queryFn: ({ pageParam }) => getProductsByTag(tag._id, { page: pageParam }),
      initialPageParam: 1
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TagProfilePage tag={tag} />;
      </HydrationBoundary>
    );
  } catch {
    notFound();
  }
}
