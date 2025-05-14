import TagProfilePage from "@/components/pages/TagProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { tagsToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  return await tagsToGenerate();
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;
  const { getTagInfo } = await prefetchServerRepo();

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
  const { getTagInfo } = await prefetchServerRepo();

  try {
    const tag = await getTagInfo(seName);
    return <TagProfilePage tag={tag} />;
  } catch {
    notFound();
  }
}
