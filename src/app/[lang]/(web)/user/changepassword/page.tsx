"use client";

import FormTextInput from "@/components/ui/FormTextInput";
import { FieldError } from "@/types";
import React, { useState } from "react";
import { useTranslation } from "@/context/Translation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import { useUserStore } from "@/stores/userStore";
import { changeUserPassword } from "@/services/auth.service";

interface FormErrors {
  original: FieldError;
  new: FieldError;
  confirm: FieldError;
}
const initialErrors: FormErrors = { original: false, new: false, confirm: false };
const initialForm = { original: "", new: "", confirm: "" };

export default function ChangePasswordPage() {
  const { user } = useUserStore();
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<FormErrors>(initialErrors);

  const changePasswordMutation = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: () => changeUserPassword(form),
    onSuccess: () => toast.success("password changed Successfuly"),
    onError: () => toast.error("Failed To change password")
  });

  const validate = () => {
    setError(initialErrors);
    let isError = false;
    let errors = { ...error };

    if (!form.original) {
      errors = { ...errors, original: t("changePassword.currentPasswordIsRequired") };
      isError = true;
    }
    if (!form.new) {
      errors = { ...errors, new: t("changePassword.newPasswordIsRequired") };
      isError = true;
    }
    if (!form.confirm) {
      errors = { ...errors, confirm: t("changePassword.confirmCurrentPasswordIsRequired") };
      isError = true;
    }
    if (form.confirm !== form.new && form.confirm) {
      errors = { ...errors, confirm: t("changePassword.confirmPasswordDoseNotMatchNewPassword") };
      isError = true;
    }
    setError({ ...errors });
    return isError;
  };

  const confirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.isRegistered) return;
    if (validate()) return;

    changePasswordMutation.mutate();
  };

  const handleFieldOnChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: false });
  };

  return (
    <form onSubmit={confirm}>
      <div className="p-4 md:mt-0">
        <FormTextInput
          error={error.original}
          label={t("changePassword.current")}
          name="original"
          placeholder={t("changePassword.current")}
          type="password"
          value={form.original}
          onChange={(e) => handleFieldOnChange(e.currentTarget.value, e.currentTarget.name)}
        />

        <FormTextInput
          error={error.new}
          label={t("changePassword.new")}
          name="new"
          placeholder={t("changePassword.new")}
          type="password"
          value={form.new}
          onChange={(e) => handleFieldOnChange(e.currentTarget.value, e.currentTarget.name)}
        />

        <FormTextInput
          error={error.confirm}
          label={t("changePassword.confirm")}
          name="confirm"
          placeholder={t("changePassword.confirm")}
          type="password"
          value={form.confirm}
          onChange={(e) => handleFieldOnChange(e.currentTarget.value, e.currentTarget.name)}
        />

        <Button
          className="float-end w-full bg-primary text-center text-white md:w-auto"
          disabled={changePasswordMutation.isPending}
          isLoading={changePasswordMutation.isPending}
        >
          {t("changePassword.confirmChange")}
        </Button>
      </div>
    </form>
  );
}
