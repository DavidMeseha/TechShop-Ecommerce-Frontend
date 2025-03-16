import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterForm, registerSchema } from "@/schemas/valdation";
import { useTranslation } from "@/context/Translation";
import FormTextInput from "@/components/FormTextInput";
import RadioGroup from "@/components/RadioGroup";
import DateDropdownNumbers from "@/components/ui/DateDropdownNumbers";
import Button from "@/components/ui/Button";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/auth.service";
import { FieldError } from "@/types";
import OverlayLayout from "../../layouts/OverlayLayout";
import { useOverlayStore } from "@/stores/overlayStore";
import { isAxiosError } from "axios";

export default function Register() {
  const { t } = useTranslation();
  const switchSignupOverlay = useOverlayStore((state) => state.switchSignupOverlay);
  const setIsRegisterOpen = useOverlayStore((state) => state.setIsRegisterOpen);
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

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (form: RegisterForm) => registerUser(form),
    onSuccess: () => switchSignupOverlay(true),
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.data?.code === "EMAIL_IN_USE") {
          return setFormError(t("auth.emailNotValid"));
        }
        setFormError(error.response?.data?.message ?? t("SomethingWentWrong"));
      }
    }
  });

  const submitForm = (form: RegisterForm) => {
    registerMutation.mutate(form);
  };

  return (
    <OverlayLayout close={() => setIsRegisterOpen(false)} title={t("auth.register")}>
      <form className="px-2" onSubmit={handleSubmit(submitForm)}>
        <div className="flex justify-between">
          <h1 className="mb-4 text-2xl font-bold">{t("auth.register")}</h1>
          <a className="p-0 text-primary hover:underline" onClick={() => switchSignupOverlay(true)}>
            {t("auth.alreadyHveAnAccount")}
          </a>
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
        <Button className="my-6 w-full bg-primary font-semibold text-white" isLoading={registerMutation.isPending}>
          {t("auth.register")}
        </Button>
      </form>
    </OverlayLayout>
  );
}
