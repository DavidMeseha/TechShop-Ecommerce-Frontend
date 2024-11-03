import FormTextInput from "../FormTextInput";
import { useState } from "react";
import { useUser } from "@/context/user";
import { BiLoaderCircle } from "react-icons/bi";
import { FieldError } from "../../types";
import { useTranslation } from "@/context/Translation";
import { useFormState } from "react-dom";
import { actionLogin } from "@/actions";

type LoginErrors = {
  password: FieldError;
  email: FieldError;
};

export default function Login() {
  const { t } = useTranslation();
  const { login } = useUser();
  const [state, formAction] = useFormState(actionLogin, { message: false });
  const [form, setForm] = useState({ password: "", email: "" });
  const [error, setError] = useState<LoginErrors>({
    password: false,
    email: false
  });

  const validate = () => {
    let isError = false;
    if (!form.email) {
      setError({ ...error, email: t("auth.enterYourEmail") });
      isError = true;
    } else if (!form.password) {
      setError({ ...error, password: t("auth.enterYourPassword") });
      isError = true;
    }
    return isError;
  };

  const loginClickHandle = async () => {
    let isError = validate();
    if (isError) return;
    login.mutate(form.email, form.password);
  };

  const fieldChangeHandle = (value: string, name: string) => {
    login.clearError();
    setError({ ...error, [name]: false });
    setForm({ ...form, [name]: value });
  };

  return (
    <form action={formAction}>
      <FormTextInput
        error={error.email}
        inputType="email"
        name="email"
        placeholder={t("auth.email")}
        value={form.email}
        onUpdate={fieldChangeHandle}
      />

      <FormTextInput
        error={error.password || login.errorMessage}
        inputType="password"
        name="password"
        placeholder={t("auth.password")}
        value={form.password}
        onUpdate={fieldChangeHandle}
      />

      {"message" in state ? <div>{state.message ?? ""}</div> : null}

      <div className="mt-6 pb-2">
        <button
          className={`flex w-full items-center justify-center rounded-sm py-3 text-[17px] font-semibold text-white ${!form.email || !form.password ? "bg-gray-200" : "bg-primary"} `}
          disabled={login.isPending}
          type="submit"
          onClick={loginClickHandle}
        >
          {login.isPending ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : t("auth.login")}
        </button>
      </div>
    </form>
  );
}
