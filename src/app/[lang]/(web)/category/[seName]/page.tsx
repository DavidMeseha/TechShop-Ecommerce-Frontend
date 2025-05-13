import CategoryProfilePage from "@/components/pages/CategoryProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { categoriesToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

async function categoryInfo(seName: string) {
  const { getCategoryInfo } = await prefetchServerRepo();
  try {
    const category = await getCategoryInfo(seName);
    return category;
  } catch {
    notFound();
  }
}

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  return await categoriesToGenerate();
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await params;
  try {
    const category = await categoryInfo(seName);
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
  const category = await categoryInfo(seName);

  return <CategoryProfilePage category={category} />;
}
