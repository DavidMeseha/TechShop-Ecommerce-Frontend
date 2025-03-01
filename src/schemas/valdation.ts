import { TFunction } from "@/types";
import z from "zod";

const passwordValidationRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export function registerSchema(t: TFunction) {
  return z
    .object({
      email: z
        .string()
        .email(t("auth.emailNotValid"))
        .min(1, { message: t("auth.emailRequired") }),
      firstName: z.string().min(1, { message: t("auth.nameRequired") }),
      lastName: z.string().min(1, { message: t("auth.nameRequired") }),
      dayOfBirth: z.string(),
      monthOfBirth: z.string(),
      yearOfBirth: z.string(),
      gender: z.enum(["male", "female"]),
      password: z
        .string()
        .regex(passwordValidationRegex, {
          message: t("auth.passwordFormatError")
        })
        .min(8, { message: t("auth.passwordMinimumLength") }),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("changePassword.confirmPasswordDoseNotMatchNewPassword"),
      path: ["confirmPassword"]
    });
}

export function loginSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t("auth.emailRequired")),
    password: z.string().min(1, { message: t("auth.passwordRequired") })
  });
}

export type RegisterForm = z.infer<ReturnType<typeof registerSchema>>;
export type LoginForm = z.infer<ReturnType<typeof loginSchema>>;
