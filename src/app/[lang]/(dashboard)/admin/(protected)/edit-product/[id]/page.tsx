import getProduct from "@/admin/services/getProduct";
import EditProductPage from "./EditProductPage";
import { notFound } from "next/navigation";
import configureServerRequest from "@/common/services/server/configureServerRequest";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: Props) {
  const { id } = await params;
  await configureServerRequest();

  try {
    const product = await getProduct(id);
    return <EditProductPage product={product} />;
  } catch {
    notFound();
  }
}
