"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import CardWrapper from "@/components/auth/card-wrapper";
import { Component1Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import * as z from "zod";
import Link from "next/link";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.BACKEND_URI}/user/log-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
        cache: "no-store",
      });
      const value = await response.json();

      if (!response.ok) {
        toast.error(value.message);
        return;
      }

      localStorage.setItem("user", JSON.stringify(value.data));
      toast.success(value.message);
      router.replace("/");
    } catch (error: any) {
      console.error("error on login Form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      socialLabel="Login with Google"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-3 w-72">
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-xs tracking-wide underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Login;
