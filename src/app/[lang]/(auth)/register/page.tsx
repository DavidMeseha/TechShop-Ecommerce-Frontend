import DateDropdownNumbers from "@/components/ui/DateDropdownNumbers";
import FormTextInput from "@/components/FormTextInput";
import RadioGroup from "@/components/RadioGroup";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getDictionary } from "@/dictionary";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import axios from "@/lib/axios";
import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Language } from "@/types";

interface Props {
  params: Promise<{ lang: Language }>;
  searchParams: Promise<{ error: string }>;
}

export default async function page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  const register = async (form: FormData) => {
    "use server";
    const data = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      dayOfBirth: form.get("day"),
      monthOfBirth: form.get("month"),
      yearOfBirth: form.get("year"),
      gender: form.get("gender")
    };

    try {
      await axios.post<{ message: string }>(
        "/api/auth/register",
        { ...data },
        { headers: { Authorization: `Bearer ${cookies().get("session")?.value}` } }
      );
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return redirect(`/${params.lang}/register?error=${encodeURIComponent(error.response?.data.message ?? "")}`);
    }

    return redirect(`/${params.lang}/login?message=${encodeURIComponent(dictionary["auth.successfullRegister"])}`);
  };

  return (
    <form className="p-4">
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">{dictionary["auth.register"]}</h1>
        <Link className="text-primary hover:underline" href={`/${params.lang}/login`}>
          {dictionary["auth.alreadyHveAnAccount"]}
        </Link>
      </div>
      <FormTextInput
        label={dictionary["firstName"]}
        name="firstName"
        placeholder={dictionary["firstName"]}
        required
        type="text"
      />

      <FormTextInput
        label={dictionary["lastName"]}
        name="lastName"
        placeholder={dictionary["lastName"]}
        required
        type="text"
      />

      <FormTextInput
        label={dictionary["auth.email"]}
        name="email"
        placeholder={dictionary["auth.email"]}
        required
        type="email"
      />

      <FormTextInput
        label={dictionary["auth.password"]}
        name="password"
        placeholder={dictionary["auth.password"]}
        required
        type="password"
      />

      <FormTextInput
        label={dictionary["auth.confirmPassword"]}
        name="confirmPassword"
        placeholder={dictionary["auth.confirmPassword"]}
        required
        type="password"
      />

      <RadioGroup
        name="gender"
        title="Gender"
        options={[
          { name: dictionary["male"], value: "male" },
          { name: dictionary["female"], value: "female" }
        ]}
      />

      <DateDropdownNumbers title="Date Of Birth" />

      <div className="text-red-600">{searchParams.error}</div>
      <SubmitButton className="my-6 w-full bg-primary font-semibold text-white" formAction={register}>
        {dictionary["auth.register"]}
      </SubmitButton>
    </form>
  );
}
