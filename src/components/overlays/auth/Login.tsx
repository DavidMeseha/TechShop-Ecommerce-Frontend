import React from "react";
import { useState } from "react";
import FormTextInput from "@/components/FormTextInput";
import { FieldError } from "@/types";
import { useTranslation } from "@/context/Translation";
import { LoginForm, loginSchema } from "@/schemas/valdation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import Button from "@/components/ui/Button";
import OverlayLayout from "../../layouts/OverlayLayout";
import { useOverlayStore } from "@/stores/overlayStore";
import { isAxiosError } from "axios";
import useUser from "@/hooks/useUser";

export default function Login() {
  const { login: handleLoginSuccess } = useUser();
  const setIsLoginOpen = useOverlayStore((state) => state.setIsLoginOpen);
  const switchSignupOverlay = useOverlayStore((state) => state.switchSignupOverlay);
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
    onSuccess: (data) => {
      if (!data) return;
      setIsLoginOpen(false);
      handleLoginSuccess(data.user, data.token);
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        if (err.response?.status === 401) setFormError(t("auth.wrongCredentials"));
        else setFormError(err.response?.data ?? "Unknow error, try again later");
      }
    }
  });

  const submitForm = (form: LoginForm) => {
    loginMutation.mutate(form);
  };

  return (
    <OverlayLayout close={() => setIsLoginOpen(false)}>
      <form className="items p-4" onSubmit={handleSubmit(submitForm)}>
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-bold">{t("auth.login")}</h1>
          <a className="p-0 text-primary hover:underline" onClick={() => switchSignupOverlay(false)}>
            {t("auth.dontHaveAnAccount")}
          </a>
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
            isLoading={loginMutation.isPending}
            type="submit"
          >
            {t("auth.login")}
          </Button>
        </div>
      </form>
    </OverlayLayout>
  );
}
