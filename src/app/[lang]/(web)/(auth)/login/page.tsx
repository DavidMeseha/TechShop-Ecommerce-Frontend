import LoginPageForm from "@/components/forms/LoginPageForm";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <LoginPageForm />;
}
