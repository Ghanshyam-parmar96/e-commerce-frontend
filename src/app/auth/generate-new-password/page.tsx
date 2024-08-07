"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import CardWrapper from "@/components/auth/card-wrapper";
import { GenerateNewPasswordSchema } from "@/schemas/auth-schema";
import { PasswordInput } from "@/components/ui/password-input";
import { FormSeparator } from "@/components/ui/form-separator";
import { generateNewPasswordAction } from "@/action/authAction";
import { Component1Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTransition } from "react";
import * as z from "zod";

interface AccountVerificationProps {
  searchParams: {
    "verify-code": string;
  };
}

const GenerateNewPassword = ({ searchParams }: AccountVerificationProps) => {
  const [loading, starTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof GenerateNewPasswordSchema>>({
    resolver: zodResolver(GenerateNewPasswordSchema),
    defaultValues: {
      verifyCode: searchParams["verify-code"] || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof GenerateNewPasswordSchema>) => {
    const isUser = localStorage.hasOwnProperty("userId");

    if (!isUser) return;
    const id = isUser && JSON.parse(localStorage.getItem("userId") as string);

    starTransition(async () => {
      const { message, success } = await generateNewPasswordAction(data, id);
      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message);
      localStorage.removeItem("userId");
      router.replace("/auth/login");
    });
  };

  return (
    <CardWrapper
      headerLabel="Create new Password"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
      socialLabel=""
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="w-80 grid place-content-center space-y-3">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      {...field}
                    >
                      <InputOTPGroup className="space-x-3">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full">
              <FormSeparator label="Create new Password" />
            </div>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="**********"
                      type="password"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="**********"
                      type="password"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <Component1Icon className="h-4 w-4 animate-spin" />
                Please wait...
              </span>
            ) : (
              "Create new Password"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default GenerateNewPassword;
