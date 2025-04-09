"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterForm, registerSchema } from "@/schemas/valdation";
import { useTranslation } from "@/context/Translation";
import { LocalLink } from "@/components/LocalizedNavigation";
import FormTextInput from "@/components/FormTextInput";
import RadioGroup from "@/components/RadioGroup";
import DateDropdownNumbers from "@/components/ui/DateDropdownNumbers";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth.service";
import { FieldError } from "@/types";
import { useRouter } from "@bprogress/next";
import { isAxiosError } from "axios";
import { useOverlayStore } from "@/stores/overlayStore";

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

  const [formError, setFormError] = useState<FieldError>(false);
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
        if (error.response?.data?.code === "EMAIL_IN_USE") {
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
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("auth.register")}</h1>
        <LocalLink className="text-sm text-primary hover:underline" href="/login">
          {t("auth.alreadyHveAnAccount")}
        </LocalLink>
      </div>
      <FormTextInput
        {...register("firstName", {
          onChange: () => clearErrors("firstName")
        })}
        error={errors.firstName?.message}
        label={t("firstName")}
        name="firstName"
        placeholder={t("firstName")}
      />

      <FormTextInput
        {...register("lastName", {
          onChange: () => clearErrors("lastName")
        })}
        error={errors.lastName?.message ?? ""}
        label={t("lastName")}
        placeholder={t("lastName")}
        required
        type="text"
      />

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

      <FormTextInput
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
      {errors.gender?.message}

      <DateDropdownNumbers
        dayInputAttributes={{ ...register("dayOfBirth") }}
        monthInputAttributes={{ ...register("monthOfBirth") }}
        title="Date Of Birth"
        yearInputAttributes={{ ...register("yearOfBirth") }}
      />

      <div className="text-red-600">{formError ?? null}</div>
      <Button
        className="my-6 w-full bg-primary font-semibold text-white"
        isLoading={registerMutation.isPending || isLoading}
      >
        {t("auth.register")}
      </Button>
    </form>
  );
}
