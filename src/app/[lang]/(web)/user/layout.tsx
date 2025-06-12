import React from "react";
import createServerServices from "@/services/server/createServerService";
import { redirect } from "next/navigation";
import { checkTokenValidity } from "@/services/auth.service";
import NotRegisterd from "@/components/pages/NotRegisterdDisplay";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const { token } = await createServerServices();

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
