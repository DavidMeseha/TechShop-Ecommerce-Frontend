import VendorProfilePage from "@/components/pages/VendorProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { PRODUCTS_QUERY_KEY, SINGLE_VENDOR_QUERY_KEY } from "@/constants/query-keys";
import { cache } from "react";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { vendorsToGenerate } from "@/services/staticGeneration.service";

export const revalidate = 600;
export const dynamicParams = true;

type Props = { params: Promise<{ seName: string }> };

const cachedVendorInfo = cache(async (seName: string) => {
  try {
    const { getVendorInfo } = await prefetchServerRepo();
    const vendor = await getVendorInfo(seName);
    return vendor;
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  return await vendorsToGenerate();
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
  const { getProductsByVendor } = await prefetchServerRepo();
  const vendor = await cachedVendorInfo(seName);

  await queryClient.prefetchInfiniteQuery({
    queryKey: [PRODUCTS_QUERY_KEY, SINGLE_VENDOR_QUERY_KEY, vendor.seName],
    queryFn: ({ pageParam }) => getProductsByVendor(vendor._id, { page: pageParam, limit: 10 }),
    initialPageParam: 1
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VendorProfilePage vendor={vendor} />
    </HydrationBoundary>
  );
}
