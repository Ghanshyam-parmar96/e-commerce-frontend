import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string({ required_error: "email is required" }).email(),
  password: z
    .string({ required_error: "password is required" })
    .min(8, { message: "Must be 8 or more characters long" }),
});

/*
  export const LoginSchema = z
  .object({
    email: z.string({ required_error: "email is required" }).email(),
    password: z
      .string({ required_error: "password is required" })
      .min(8, { message: "Must be 8 or more characters long" }),
    confirmPassword: z.string({
      required_error: "confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
  */
