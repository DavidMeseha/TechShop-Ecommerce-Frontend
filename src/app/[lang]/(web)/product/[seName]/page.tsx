import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { IFullProduct } from "@/types";
import ProductPage from "@/components/pages/ProductPage";
import { homeFeedProducts } from "@/services/products.service";
import { BASE_URL } from "@/lib/axios";

interface Props {
  params: Promise<{ seName: string }>;
}

export const revalidate = 3600;

async function getProduct(seName: string): Promise<IFullProduct> {
  try {
    const res = await fetch(`${BASE_URL}/api/product/details/${seName}`, {
      next: {
        revalidate: 3600 // 60 minutes
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    return res.json();
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const products = await homeFeedProducts({ page: 1, limit: 20 });
    return products.data.map((product) => ({
      seName: product.seName
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await params;
  try {
    const [product, parentMeta] = await Promise.all([getProduct(seName), parent]);

    return {
      title: `${parentMeta.title?.absolute} | ${product.name}`,
      description: product.fullDescription,
      openGraph: {
        type: "website",
        images: product.pictures.map((image) => image.imageUrl),
        title: `${parentMeta.title?.absolute} | ${product.name}`,
        description: product.fullDescription
      }
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function Page({ params }: Props) {
  const { seName } = await params;
  const product = await getProduct(seName);

  return <ProductPage product={product} />;
}
