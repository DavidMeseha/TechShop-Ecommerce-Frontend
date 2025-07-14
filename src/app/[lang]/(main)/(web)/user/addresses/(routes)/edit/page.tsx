import configureServerRequests from "@/common/services/server/configureServerRequest";
import React from "react";
import EditAddressPage from "../../pages/EditAddressPage";
import { userAdresses } from "@/web/services/user.service";

export default async function page() {
  await configureServerRequests();
  const addresses = await userAdresses();
  return <EditAddressPage addresses={addresses} preSelectedAddress={undefined} />;
}
