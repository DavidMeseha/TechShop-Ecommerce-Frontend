import createServerServices from "@/services/server/createServerService";
import React from "react";
import EditAddressPage from "../../pages/EditAddressPage";
import { userAdresses } from "@/services/user.service";

export default async function page() {
  await createServerServices();
  const addresses = await userAdresses();
  return <EditAddressPage addresses={addresses} preSelectedAddress={undefined} />;
}
