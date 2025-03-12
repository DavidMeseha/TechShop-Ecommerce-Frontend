import CategoryProfilePage from "@/components/pages/CategoryProfilePage";
import { ICategory } from "@/types";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ seName: string }> };

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
  const seName = (await params).seName;
  try {
    const category = await getCategoryInfo(seName);
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
  const seName = (await params).seName;
  try {
    const category = await getCategoryInfo(seName);
    return <CategoryProfilePage category={category} />;
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response) {
      if (error.response.status === 404) {
        notFound();
      } else if (error.response.status >= 400 && error.response.status < 500) {
        throw new Error(`Client error: ${error.response.status} ${error.response.statusText}`, { cause: error });
      } else if (error.response.status >= 500) {
        throw new Error(`Server error: ${error.response.status} ${error.response.statusText}`, { cause: error });
      }
    } else if (error.request) {
      throw new Error("Network error: No response received", { cause: error });
    } else {
      throw new Error(`Request error: ${error.message}`, { cause: error });
    }
  }
}
