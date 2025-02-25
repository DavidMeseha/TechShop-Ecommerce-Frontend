import z from "zod";

const passwordValidationRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

export const registerSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1, { message: "Field is required" }),
    lastName: z.string().min(1, { message: "Field is required" }),
    dayOfBirth: z.string(),
    monthOfBirth: z.string(),
    yearOfBirth: z.string(),
    gender: z.enum(["male", "female"]),
    password: z
      .string()
      .regex(passwordValidationRegex, {
        message: "Password should contain at least an Uppercase, a Special character and a number"
      })
      .min(8, { message: "Password should be 8 character length or more" }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;
