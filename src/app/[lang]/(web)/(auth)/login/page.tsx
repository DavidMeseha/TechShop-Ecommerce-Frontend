"use client";

import { useState } from "react";
import FormTextInput from "@/components/FormTextInput";
import { FieldError } from "@/types";
import { useRouter } from "next-nprogress-bar";
import { LocalLink } from "@/components/LocalizedNavigation";
import { useTranslation } from "@/context/Translation";
import { LoginForm, loginSchema } from "@/schemas/valdation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import Button from "@/components/ui/Button";
import { useUserSetup } from "@/context/UserProvider";

export default function Page() {
  const { setupUser } = useUserSetup();
  const { t } = useTranslation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema(t))
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<FieldError>(false);

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (form: LoginForm) => login(form),
    onSuccess: async (data) => {
      setupUser(data);
      router.push("/");
    },
    onError: (error) => {
      setIsLoading(false);
      setFormError(error.message ?? "Unknow error, try again later");
    }
  });

  const submitForm = (form: LoginForm) => {
    setIsLoading(true);
    loginMutation.mutate(form);
  };

  return (
    <form className="items flex h-screen flex-col p-4 pt-14" onSubmit={handleSubmit(submitForm)}>
      <div className="flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">{t("auth.login")}</h1>
        <LocalLink className="text-primary hover:underline" href="/register">
          {t("auth.dontHaveAnAccount")}
        </LocalLink>
      </div>
      <FormTextInput
        {...register("email", {
          onChange: () => clearErrors("email")
        })}
        error={errors.email?.message}
        label={t("auth.email")}
        placeholder={t("auth.email")}
        required
        type="email"
      />
      <FormTextInput
        {...register("password", {
          onChange: () => clearErrors("password")
        })}
        error={errors.password?.message}
        label={t("auth.password")}
        placeholder={t("auth.password")}
        required
        type="password"
      />
      <div className="min-h-[21px] text-[14px] font-semibold text-red-500">{formError}</div>
      <div className="mt-2 pb-2">
        <Button
          className={`w-full bg-primary py-3 text-base font-semibold text-white`}
          isLoading={loginMutation.isPending || isLoading}
          type="submit"
        >
          {t("auth.login")}
        </Button>
      </div>
    </form>
  );
}
