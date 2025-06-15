import configureServerRequests from "@/services/server/configureServerRequest";
import React from "react";
import EditAddressPage from "../../pages/EditAddressPage";
import { userAdresses } from "@/services/user.service";

export default async function page() {
  await configureServerRequests();
  const addresses = await userAdresses();
  return <EditAddressPage addresses={addresses} preSelectedAddress={undefined} />;
}
