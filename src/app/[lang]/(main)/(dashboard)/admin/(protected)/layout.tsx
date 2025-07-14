import { checkTokenValidity } from "@/common/services/auth.service";
import configureServerRequest from "@/common/services/server/configureServerRequest";
import { IUser, Language } from "@/types";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ lang: Language }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { lang } = await params;
  await configureServerRequest();

  let user: IUser;
  try {
    user = await checkTokenValidity();
  } catch {
    redirect("/" + lang + "/admin/register");
  }

  if (!user.isRegistered) redirect("/" + lang + "/login");
  if (!user.isVendor) redirect("/" + lang + "/admin/register");

  return children;
}
