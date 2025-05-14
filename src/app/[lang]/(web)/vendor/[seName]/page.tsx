import VendorProfilePage from "@/components/pages/VendorProfilePage";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import prefetchServerRepo from "@/services/prefetchServerRepo";
import { vendorsToGenerate } from "@/services/staticGeneration.service";

type Props = { params: Promise<{ seName: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  return await vendorsToGenerate();
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { seName } = await props.params;
  const { getVendorInfo } = await prefetchServerRepo();

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
  const { getVendorInfo } = await prefetchServerRepo();
  try {
    const vendor = await getVendorInfo(seName);
    return <VendorProfilePage vendor={vendor} />;
  } catch {
    notFound();
  }
}
