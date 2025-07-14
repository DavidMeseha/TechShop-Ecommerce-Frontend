import React from "react";
import configureServerRequests from "@/common/services/server/configureServerRequest";
import { redirect } from "next/navigation";
import { checkTokenValidity } from "@/common/services/auth.service";
import NotRegisterd from "@/web/components/pages/NotRegisterdDisplay";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const { token } = await configureServerRequests();

  try {
    if (token) await checkTokenValidity();
  } catch {
    redirect("/login");
  }

  return (
    <div className="md:mt-0">
      <NotRegisterd>{children}</NotRegisterd>
    </div>
  );
}
