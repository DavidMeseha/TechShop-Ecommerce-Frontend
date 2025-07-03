"use client";

import { useState } from "react";
import FormInput from "@/common/components/ui/extend/FormInput";
import { FieldError } from "@/types";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import { useTranslation } from "@/common/context/Translation";
import { LoginForm, loginSchema } from "@/web/schemas/valdation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/common/services/auth.service";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { isAxiosError } from "axios";
import { useUserSetup } from "@/common/context/User";
import { useOverlayStore } from "@/web/stores/overlayStore";
import { Button } from "@/common/components/ui/button";
import ErrorMessage from "@/common/components/ui/extend/ErrorMessage";

export default function LoginPageForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useUserSetup();
  const switchSignupOverlay = useOverlayStore((state) => state.switchSignupOverlay);
  const isLoginOpen = useOverlayStore((state) => state.isLoginOpen);
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema(t))
  });

  const [formError, setFormError] = useState<FieldError>();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (form: LoginForm) => login(form),
    onSuccess: async (data) => {
      setIsLoading(true);
      await loginUser(data);
      if (isLoginOpen) setIsLoginOpen(false);
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
    <form className="space-y-2" onSubmit={handleSubmit(submitForm)}>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("auth.login")}</h1>
          {isLoginOpen ? (
            <Button variant="link" onClick={() => switchSignupOverlay(false)}>
              {t("auth.dontHaveAnAccount")}
            </Button>
          ) : (
            <LocalLink className="text-sm text-primary hover:underline" href="/register">
              {t("auth.dontHaveAnAccount")}
            </LocalLink>
          )}
        </div>
        <FormInput
          {...register("email", {
            onChange: () => clearErrors("email")
          })}
          error={errors.email?.message}
          label={t("auth.email")}
          placeholder={t("auth.email")}
          required
          type="email"
        />
        <FormInput
          {...register("password", {
            onChange: () => clearErrors("password")
          })}
          error={errors.password?.message}
          label={t("auth.password")}
          placeholder={t("auth.password")}
          required
          type="password"
        />
        <ErrorMessage error={formError} />
      </div>
      <div>
        <SubmitButton
          className="w-full bg-primary text-primary-foreground"
          isLoading={loginMutation.isPending || isLoading}
          type="submit"
        >
          {t("auth.login")}
        </SubmitButton>
      </div>
    </form>
  );
}
