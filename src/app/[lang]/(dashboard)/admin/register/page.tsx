import { redirect } from "next/navigation";
import RegisterVendorPage from "./RegisterVendorPage";
import { IUser, Language } from "@/types";
import { checkTokenValidity } from "@/common/services/auth.service";
import configureServerRequests from "@/common/services/server/configureServerRequest";

type Props = {
  params: Promise<{ lang: Language }>;
};

export default async function Page({ params }: Props) {
  const { lang } = await params;
  await configureServerRequests();

  let user: IUser;
  try {
    user = await checkTokenValidity();
  } catch {
    redirect("/" + lang + "/login");
  }

  if (!user.isRegistered) redirect("/" + lang + "/login");
  if (user.isVendor) redirect("/" + lang + "/admin/products");

  return <RegisterVendorPage />;
}
