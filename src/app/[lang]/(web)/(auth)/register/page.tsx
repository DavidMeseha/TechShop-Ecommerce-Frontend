import RegisterForm from "@/web/components/forms/RegisterForm";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <RegisterForm />;
}
