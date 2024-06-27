import * as z from "zod";

const passwordStrengthSchema = z.string().superRefine((password, ctx) => {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must be at least 8 characters long.",
    });
  } else {
    if (
      !(
        (hasUpper && hasLower && hasDigit) ||
        (hasUpper && hasLower && hasSpecial) ||
        (hasUpper && hasDigit && hasSpecial) ||
        (hasLower && hasDigit && hasSpecial)
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Password must contain at least three types of characters: uppercase, lowercase, digits, special characters.",
      });
    }
  }
});

export const LoginSchema = z.object({
  email: z.string({ required_error: "email is required" }).email(),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "Must be 8 or more characters long" }),
});

export const RegisterSchema = z
  .object({
    fullName: z.string({ required_error: "name is required" }),
    email: z.string({ required_error: "email is required" }).email(),
    gender: z
      .enum(["male", "female"], {
        required_error: "Gender is required",
      })
      .optional(),
    DOB: z.date().optional(),
    password: passwordStrengthSchema,
    confirmPassword: z.string({
      required_error: "confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const AccountVerificationSchema = z.object({
  verifyCode: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string({ required_error: "email is required" }).email(),
});

export const GenerateNewPasswordSchema = z
  .object({
    verifyCode: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
    password: passwordStrengthSchema,
    confirmPassword: z.string({
      required_error: "confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
