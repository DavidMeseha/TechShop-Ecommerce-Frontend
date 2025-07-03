import VendorProfilePage from "../VendorProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getProductsByVendor, getVendorInfo } from "@/web/services/catalog.service";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import { PRODUCTS_QUERY_KEY, SINGLE_VENDOR_QUERY_KEY } from "@/common/constants/query-keys";

type Props = { params: Promise<{ seName: string }> };

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;

  try {
    const [vendor, parentMeta] = await Promise.all([getVendorInfo(seName), parent]);

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

export default async function Page(props: Props) {
  const { seName } = await props.params;
  const queryClient = new QueryClient();
  await configureServerRequest();

  try {
    const vendor = await getVendorInfo(seName);

    await queryClient.prefetchInfiniteQuery({
      queryKey: [PRODUCTS_QUERY_KEY, SINGLE_VENDOR_QUERY_KEY, seName],
      queryFn: ({ pageParam }) => getProductsByVendor(vendor._id, { page: pageParam, limit: 10 }),
      initialPageParam: 1
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VendorProfilePage vendor={vendor} />;
      </HydrationBoundary>
    );
  } catch {
    notFound();
  }
}
