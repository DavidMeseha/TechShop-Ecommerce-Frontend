import RegisterPageForm from "@/components/forms/RegisterPageForm";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <RegisterPageForm />;
}
