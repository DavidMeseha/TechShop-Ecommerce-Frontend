"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterForm, registerSchema } from "@/web/schemas/valdation";
import { useTranslation } from "@/common/context/Translation";
import { LocalLink } from "@/common/components/utils/LocalizedNavigation";
import FormInput from "@/common/components/ui/extend/FormInput";
import RadioGroup from "@/common/components/ui/extend/RadioGroup";
import DateDropdownNumbers from "@/common/components/ui/extend/DateDropdownNumbers";
import { SubmitButton } from "@/common/components/ui/extend/SubmitButton";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/common/services/auth.service";
import { FieldError } from "@/types";
import { useRouter } from "@bprogress/next";
import { isAxiosError } from "axios";
import { useOverlayStore } from "@/web/stores/overlayStore";
import ErrorMessage from "@/common/components/ui/extend/ErrorMessage";

export default function RegisterPageForm() {
  const switchSignupOverlay = useOverlayStore((state) => state.switchSignupOverlay);
  const isRegisterOpen = useOverlayStore((state) => state.isRegisterOpen);
  const { t } = useTranslation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    ...rest
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema(t)),
    defaultValues: {
      gender: "male"
    }
  });

  const [formError, setFormError] = useState<FieldError>();
  const [isLoading, setIsLoading] = useState(false);

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (form: RegisterForm) => registerUser(form),
    onSuccess: () => {
      if (isRegisterOpen) switchSignupOverlay(true);
      else router.push("/login");
    },
    onError: (error) => {
      setIsLoading(false);
      if (isAxiosError(error)) {
        if (error.response?.data?.message === "EMAIL_IN_USE") {
          return setFormError(t("auth.emailNotValid"));
        }
        setFormError(error.response?.data?.message ?? t("SomethingWentWrong"));
      }
    }
  });

  const submitForm = (form: RegisterForm) => {
    setIsLoading(true);
    registerMutation.mutate(form);
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit(submitForm)}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("auth.register")}</h1>
        <LocalLink className="text-sm text-primary hover:underline" href="/login">
          {t("auth.alreadyHveAnAccount")}
        </LocalLink>
      </div>
      <FormInput
        {...register("firstName", {
          onChange: () => clearErrors("firstName")
        })}
        error={errors.firstName?.message}
        label={t("firstName")}
        name="firstName"
        placeholder={t("firstName")}
      />

      <FormInput
        {...register("lastName", {
          onChange: () => clearErrors("lastName")
        })}
        error={errors.lastName?.message ?? ""}
        label={t("lastName")}
        placeholder={t("lastName")}
        required
        type="text"
      />

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

      <FormInput
        {...register("confirmPassword", {
          onChange: () => clearErrors("confirmPassword")
        })}
        error={errors.confirmPassword?.message}
        label={t("auth.confirmPassword")}
        placeholder={t("auth.confirmPassword")}
        required
        type="password"
      />

      <RadioGroup
        title="Gender"
        value={rest.getValues("gender")}
        options={[
          { name: t("male"), value: "male" },
          { name: t("female"), value: "female" }
        ]}
        zodRegister={register("gender", {
          onChange: () => clearErrors("gender")
        })}
      />
      <ErrorMessage error={errors.gender?.message} />

      <DateDropdownNumbers
        dayInputAttributes={{ ...register("dayOfBirth") }}
        monthInputAttributes={{ ...register("monthOfBirth") }}
        title="Date Of Birth"
        yearInputAttributes={{ ...register("yearOfBirth") }}
      />

      <ErrorMessage error={formError} />
      <SubmitButton
        className="my-6 w-full bg-primary font-semibold text-white"
        isLoading={registerMutation.isPending || isLoading}
      >
        {t("auth.register")}
      </SubmitButton>
    </form>
  );
}
