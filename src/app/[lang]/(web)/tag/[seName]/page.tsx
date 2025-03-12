import axios from "@/lib/axios";
import { ITag } from "@/types";
import TagProfilePage from "@/components/pages/TagProfilePage";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ seName: string }> };

const getTagInfo = cache(async (seName: string) => {
  return await axios.get<ITag>(`/api/Catalog/tag/${seName}`).then((res) => res.data);
});

export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const tags = await axios.get<{ seName: string }[]>(`/api/catalog/allTags`).then((res) => res.data);
  return tags.map((tag) => ({
    seName: tag.seName
  }));
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const seName = (await props.params).seName;
  try {
    const tag = await getTagInfo(seName);
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
  const seName = (await props.params).seName;
  try {
    const tag = await getTagInfo(seName);
    return <TagProfilePage tag={tag} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) notFound();
  }
}
