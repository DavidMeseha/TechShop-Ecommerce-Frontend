"use client";

import { useState } from "react";
import FormTextInput from "@/components/FormTextInput";
import { FieldError } from "@/types";
import { LocalLink } from "@/components/LocalizedNavigation";
import { useTranslation } from "@/context/Translation";
import { LoginForm, loginSchema } from "@/schemas/valdation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import Button from "@/components/ui/Button";
import { isAxiosError } from "axios";
import { useUserSetup } from "@/context/UserProvider";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useUserSetup();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema(t))
  });

  const [formError, setFormError] = useState<FieldError>(false);

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (form: LoginForm) => login(form),
    onSuccess: async (data) => {
      setIsLoading(true);
      loginUser(data);
    },
    onError: (err) => {
      setIsLoading(false);
      if (isAxiosError(err)) {
        if (err.response?.status === 403) setFormError(t("auth.wrongCredentials"));
        else setFormError(JSON.stringify(err.response?.data ?? "Unknow error, try again later"));
      }
    }
  });

  const submitForm = (form: LoginForm) => loginMutation.mutate(form);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("auth.login")}</h1>
          <LocalLink className="text-sm text-primary hover:underline" href="/register">
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
      </div>
      <div className="mb-2 min-h-[21px] text-[14px] font-semibold text-red-500">{formError}</div>
      <div>
        <Button
          className="w-full bg-primary text-primary-foreground"
          isLoading={loginMutation.isPending || isLoading}
          type="submit"
        >
          {t("auth.login")}
        </Button>
      </div>
    </form>
  );
}
