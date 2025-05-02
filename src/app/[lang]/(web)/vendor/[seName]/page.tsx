import VendorProfilePage from "@/components/pages/VendorProfilePage";
import axios from "@/lib/axios";
import { Metadata, ResolvingMetadata } from "next";
// import { isAxiosError } from "axios";
// import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { PRODUCTS_QUERY_KEY, SINGLE_VENDOR_QUERY_KEY } from "@/constants/query-keys";
import productsServerRepo from "@/services/server.service";
import { cache } from "react";
import { getVendorInfo } from "@/services/products.service";
import { notFound } from "next/navigation";

export const revalidate = 600;
export const dynamicParams = true;

type Props = { params: Promise<{ seName: string }> };

const cachedVendorInfo = cache(async (seName: string) => {
  try {
    const vendor = await getVendorInfo(seName);
    return vendor;
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  const vendors = await axios.get<{ seName: string }[]>(`/api/catalog/allVendors`).then((res) => res.data);
  return vendors.map((vendor) => ({
    seName: vendor.seName
  }));
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;
  try {
    const vendor = await cachedVendorInfo(seName);
    const parentMeta = await parent;

    return {
      title: `${parentMeta.title?.absolute} | ${vendor.name}`,
      description: vendor.seName + " " + vendor.productCount,
      openGraph: {
        type: "website",
        title: `${parentMeta.title?.absolute} | ${vendor.name}`,
        description: vendor.seName + " " + vendor.productCount
      }
    };
  } catch {
    return { title: "Error" };
  }
}

const queryClient = new QueryClient({});

export default async function Page(props: Props) {
  const { seName } = await props.params;
  const { getProductsByVendor } = await productsServerRepo();

  const vendor = await cachedVendorInfo(seName);

  await queryClient.prefetchInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, SINGLE_VENDOR_QUERY_KEY, vendor.seName],
    queryFn: ({ pageParam = 1 }) => getProductsByVendor(vendor._id, { page: pageParam, limit: 10 }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VendorProfilePage vendor={vendor} />
    </HydrationBoundary>
  );
}
