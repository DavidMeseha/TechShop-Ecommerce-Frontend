import CategoryProfilePage from "@/components/pages/CategoryProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { categoriesToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  return await categoriesToGenerate();
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await params;
  const { getCategoryInfo } = await prefetchServerRepo();

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
  const { getCategoryInfo } = await prefetchServerRepo();

  try {
    const category = await getCategoryInfo(seName);
    return <CategoryProfilePage category={category} />;
  } catch {
    notFound();
  }
}
