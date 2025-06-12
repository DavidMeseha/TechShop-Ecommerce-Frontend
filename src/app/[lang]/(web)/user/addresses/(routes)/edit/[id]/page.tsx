import createServerServices from "@/services/server/createServerService";
import React from "react";
import EditAddressPage from "../../../pages/EditAddressPage";
import { userAdresses } from "@/services/user.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: Props) {
  const { id } = await params;
  await createServerServices();
  const addresses = await userAdresses();

  return <EditAddressPage addresses={addresses} preSelectedAddress={addresses.find((address) => address._id === id)} />;
}
