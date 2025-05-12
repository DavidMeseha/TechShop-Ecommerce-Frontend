import TagProfilePage from "@/components/pages/TagProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { tagsToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

const cachedTagInfo = cache(async (seName: string) => {
  const { getTagInfo } = await prefetchServerRepo();
  try {
    return await getTagInfo(seName);
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  try {
    return await tagsToGenerate();
  } catch {
    return [];
  }
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

export default async function Page(props: Props) {
  const { seName } = await props.params;
  const tag = await cachedTagInfo(seName);

  return <TagProfilePage tag={tag} />;
}
