import VendorProfilePage from "@/components/pages/VendorProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { vendorsToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

async function vendorInfo(seName: string) {
  try {
    const { getVendorInfo } = await prefetchServerRepo();
    const vendor = await getVendorInfo(seName);
    return vendor;
  } catch {
    notFound();
  }
}

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  return await vendorsToGenerate();
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;
  try {
    const vendor = await vendorInfo(seName);
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
  const vendor = await vendorInfo(seName);

  return <VendorProfilePage vendor={vendor} />;
}
