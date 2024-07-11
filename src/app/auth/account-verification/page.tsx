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
import { resendEmailOtp, verifyAccountAction } from "@/action/authAction";
import { AccountVerificationSchema } from "@/schemas/auth-schema";
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

const AccountVerification = ({ searchParams }: AccountVerificationProps) => {
  const [loading, starTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof AccountVerificationSchema>>({
    resolver: zodResolver(AccountVerificationSchema),
    defaultValues: {
      verifyCode: searchParams["verify-code"] || "",
    },
  });

  const resendEmailHandler = async () => {
    const isUser = localStorage.hasOwnProperty("userId");

    if (!isUser) return;
    const id = isUser && JSON.parse(localStorage.getItem("userId") as string);
    starTransition(async () => {
      const { message, success } = await resendEmailOtp(id);

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success("Email has been sent");
    });
  };

  const onSubmit = async (data: z.infer<typeof AccountVerificationSchema>) => {
    const isUser = localStorage.hasOwnProperty("userId");

    if (!isUser) return;
    const id = isUser && JSON.parse(localStorage.getItem("userId") as string);

    starTransition(async () => {
      const { message, success } = await verifyAccountAction(data, id);

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success("Account has been verified");
      localStorage.removeItem("userId");
      router.replace("/");
    });
  };

  return (
    <CardWrapper
      headerLabel="Verify your Account"
      backButtonLabel="Back to Register"
      backButtonHref="/auth/register"
      socialLabel=""
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="w-72 grid place-content-center">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>One-Time Password</FormLabel>
                    <Button
                      className="-mr-5 text-xs text-sky-600"
                      variant="link"
                      type="button"
                      onClick={resendEmailHandler}
                      disabled={loading}
                    >
                      Resend OTP
                    </Button>
                  </div>
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
              "Verify"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default AccountVerification;
