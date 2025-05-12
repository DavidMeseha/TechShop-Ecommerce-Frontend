import VendorProfilePage from "@/components/pages/VendorProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { vendorsToGenerate } from "@/services/staticGeneration.service";

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

export default async function Page(props: Props) {
  const { seName } = await props.params;
  const vendor = await cachedVendorInfo(seName);

  return <VendorProfilePage vendor={vendor} />;
}
