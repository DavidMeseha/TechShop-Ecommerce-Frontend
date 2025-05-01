import { IFullProduct, IVendor, Pagination } from "@/types";
import VendorProfilePage from "@/components/pages/VendorProfilePage";
import axios from "@/lib/axios";
import { cache } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { AxiosError } from "axios";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

type Props = { params: Promise<{ seName: string }> };

const getVendorInfo = cache(async (seName: string) => {
  return await axios
    .get<IVendor>(`/api/catalog/vendor/${seName}`, {
      headers: {
        Authorization: `Bearer ${(await cookies()).get("session")?.value}`
      }
    })
    .then((res) => res.data);
});

async function getProductsByVendor(vendorId: string, params: { page: number; limit: number }) {
  return axios
    .get<{
      data: IFullProduct[];
      pages: Pagination;
    }>(`/api/catalog/VendorProducts/${vendorId}`, {
      params,
      headers: { Authorization: `Bearer ${(await cookies()).get("session")?.value}` }
    })
    .then((res) => res.data);
}

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const vendors = await axios.get<{ seName: string }[]>(`/api/catalog/allVendors`).then((res) => res.data);
  return vendors.map((vendor) => ({
    seName: vendor.seName
  }));
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;
  try {
    const vendor = await getVendorInfo(seName);
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

  try {
    const vendor = await getVendorInfo(seName);

    await queryClient.prefetchInfiniteQuery({
      queryKey: ["products", "vendor", vendor.seName],
      queryFn: ({ pageParam = 1 }) => getProductsByVendor(vendor._id, { page: pageParam, limit: 10 }),
      initialPageParam: 1
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VendorProfilePage vendor={vendor} />
      </HydrationBoundary>
    );
  } catch (err: any) {
    const error = err as AxiosError;
    if (error.response && error.response.status >= 400 && error.response.status < 500) notFound();
  }
}
