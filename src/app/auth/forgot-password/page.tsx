"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "@/components/auth/card-wrapper";
import { ForgotPasswordSchema } from "@/schemas/auth-schema";
import { Component1Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import * as z from "zod";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      const response = await fetch(
        `${process.env.BACKEND_URI}/user/me/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
          cache: "no-store",
        }
      );
      const value = await response.json();

      if (!response.ok) {
        toast.error(value.message);
        return;
      }

      toast.success(value.message);
      localStorage.setItem("user", JSON.stringify(value.data));
      localStorage.setItem("userId", JSON.stringify(value.data._id));
      router.replace("/auth/generate-new-password");
    } catch (error) {
      console.error("An error occurred while forgot password", error);
    } finally {
      setLoading(false);
    }
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
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="johndoe@example.com"
                    type="email"
                    required
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              "Verify Email"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotPassword;
