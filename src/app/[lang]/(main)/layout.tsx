import { ReactNode } from "react";
import MainLayout from "@/common/layouts/main/MainLayout";

export default async function Layout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
