import LoginPageForm from "@/web/components/forms/LoginForm";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <LoginPageForm />;
}
