"use client";

import FormTextInput from "@/components/FormTextInput";
import { useUser } from "@/context/user";
import { FieldError } from "@/types";
import React, { useState } from "react";
import { useTranslation } from "@/context/Translation";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import Button from "@/components/Button";

interface FormErrors {
  original: FieldError;
  new: FieldError;
  confirm: FieldError;
}
const initialErrors: FormErrors = { original: false, new: false, confirm: false };
const initialForm = { original: "", new: "", confirm: "" };

export default function ChangePasswordPage() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<FormErrors>(initialErrors);

  const changePasswordMutation = useMutation({
    mutationFn: () =>
      axios.post("/api/user/ChangePassword", {
        password: form.original,
        newPassword: form.new
      }),
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
      <div className="mt-16 px-4 md:mt-0">
        <FormTextInput
          error={error.original}
          label={t("changePassword.current")}
          name="original"
          placeholder={t("changePassword.current")}
          type="password"
          value={form.original}
          onChange={(e) => handleFieldOnChange(e.target.value, e.target.name)}
        />

        <FormTextInput
          error={error.new}
          label={t("changePassword.new")}
          name="new"
          placeholder={t("changePassword.new")}
          type="password"
          value={form.new}
          onChange={(e) => handleFieldOnChange(e.target.value, e.target.name)}
        />

        <FormTextInput
          error={error.confirm}
          label={t("changePassword.confirm")}
          name="confirm"
          placeholder={t("changePassword.confirm")}
          type="password"
          value={form.confirm}
          onChange={(e) => handleFieldOnChange(e.target.value, e.target.name)}
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
