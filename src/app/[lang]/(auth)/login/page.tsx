import FormTextInput from "@/components/FormTextInput";
import { getDictionary } from "@/dictionary";
import { SubmitButton } from "@/components/ui/SubmitButton";
import axios from "@/lib/axios";
import { Language, User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { setLanguage, setToken } from "@/actions";

interface Props {
  params: Promise<{ lang: Language }>;
  searchParams: Promise<{ error: string }>;
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  const login = async (form: FormData) => {
    "use server";
    const email = form.get("email");
    const password = form.get("password");

    let userLang;
    try {
      const res = await axios
        .post<{
          user: User;
          token: string;
        }>(
          "/api/auth/login",
          { email, password },
          { headers: { Authorization: `Bearer ${cookies().get("session")?.value}` } }
        )
        .then((data) => data.data);

      setToken(res.token);
      setLanguage(res.user.language);
      userLang = res.user.language;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return redirect(
        `/${params.lang}/login?error=${encodeURIComponent(error.response?.data.message ?? error.message)}`
      );
    }

    return redirect(`/${userLang}`);
  };

  return (
    <form className="items flex h-screen flex-col p-4 pt-14">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">{dictionary["auth.login"]}</h1>
        <Link className="text-primary hover:underline" href={`/${params.lang}/register`}>
          {dictionary["auth.dontHaveAnAccount"]}
        </Link>
      </div>
      <FormTextInput name="email" placeholder={dictionary["auth.email"]} type="email" />
      <FormTextInput name="password" placeholder={dictionary["auth.password"]} type="password" />
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{searchParams.error}</div>
      <div className="mt-2 pb-2">
        <SubmitButton
          className={`w-full bg-primary py-3 text-base font-semibold text-white`}
          formAction={login}
          type="submit"
        >
          {dictionary["auth.login"]}
        </SubmitButton>
      </div>
    </form>
  );
}
