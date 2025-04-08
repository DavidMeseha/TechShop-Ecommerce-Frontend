import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { IFullProduct } from "@/types";
import ProductPage from "@/components/pages/ProductPage";
import { homeFeedProducts } from "@/services/products.service";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/axios";

interface Props {
  params: Promise<{ seName: string }>;
}

export const revalidate = 600_000;

const getProduct = cache(async (seName: string): Promise<IFullProduct> => {
  try {
    const product: IFullProduct = await fetch(`${BASE_URL}/api/product/details/${seName}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${(await cookies()).get("session")?.value}`
      }
    }).then((res) => res.json());
    return product;
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  const products = await homeFeedProducts({ page: 1, limit: 5 });
  return products.data.map((product) => ({
    seName: product.seName
  }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const seName = (await params).seName;
  try {
    const [product, parentMeta] = await Promise.all([getProduct(seName), parent]);

    const metadata: Metadata = {
      title: `${parentMeta.title?.absolute} | ${product.name}`,
      description: product.fullDescription,
      openGraph: {
        type: "website",
        images: product.pictures.map((image) => image.imageUrl),
        title: `${parentMeta.title?.absolute} | ${product.name}`,
        description: product.fullDescription
      }
    };

    return metadata;
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function Page({ params }: Props) {
  const seName = (await params).seName;
  try {
    const product = await getProduct(seName);
    return <ProductPage product={product} />;
  } catch {
    notFound();
  }
}
