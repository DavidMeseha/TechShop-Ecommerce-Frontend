import configureServerRequests from "@/common/services/server/configureServerRequest";
import React from "react";
import EditAddressPage from "../../../pages/EditAddressPage";
import { userAdresses } from "@/web/services/user.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function page({ params }: Props) {
  const { id } = await params;
  await configureServerRequests();
  const addresses = await userAdresses();

  return <EditAddressPage addresses={addresses} preSelectedAddress={addresses.find((address) => address._id === id)} />;
}
