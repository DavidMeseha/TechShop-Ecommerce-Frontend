import RegisterPageForm from "@/components/forms/RegisterForm";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <RegisterPageForm />;
}
