import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { AxiosError } from "axios";
import { IFullProduct } from "@/types";
import axios from "@/lib/axios";
import ProductPage from "../ProductPage";
import { homeFeedProducts } from "@/services/products.service";

interface Props {
  params: { seName: string };
}

const getProduct = cache(async (seName: string): Promise<IFullProduct> => {
  try {
    const response = await axios.get<IFullProduct>(`/api/product/details/${seName}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
      notFound();
    }
    throw error;
  }
});

export const revalidate = 120;
export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await homeFeedProducts({ page: 1, limit: 5 });
  return products.map((product) => ({
    seName: product.seName
  }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  try {
    const [product, parentMeta] = await Promise.all([getProduct(params.seName), parent]);

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
  try {
    const product = await getProduct(params.seName);
    return <ProductPage product={product} />;
  } catch {
    notFound();
  }
}
