import ViewCategoryProfile from "../../components/ViewCategoryProfile";
import { ICategory } from "@/types";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { seName: string } };

const getCategoryInfo = cache(async (seName: string) => {
  return await axios.get<ICategory>(`/api/Catalog/Category/${seName}`).then((res) => res.data);
});

export const revalidate = 600;
export const dynamicParams = true;
export async function generateStaticParams() {
  const categories = await axios.get<{ seName: string }[]>(`/api/catalog/allCategories`).then((res) => res.data);
  return categories.map((category) => ({
    seName: category.seName
  }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const category = await getCategoryInfo(params.seName);
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

export default async function Page({ params }: Props) {
  try {
    const category = await getCategoryInfo(params.seName);
    return <ViewCategoryProfile category={category} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) notFound();
  }
}
