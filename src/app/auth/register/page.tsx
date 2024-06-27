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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PasswordInput } from "@/components/ui/password-input";
import CardWrapper from "@/components/auth/card-wrapper";
import { RegisterSchema } from "@/schemas/auth-schema";
import { Component1Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import * as z from "zod";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    console.log(data);
  };

  return (
    <CardWrapper
      headerLabel="Create an Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      socialLabel="Register with Google"
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid gap-y-4 gap-x-5 sm:grid-cols-2 max-w-lg">
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full_name
                    <sup className="text-red-700 font-extrabold text-[9px]">
                      ✶
                    </sup>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john doe"
                      type="text"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email
                    <sup className="text-red-700 font-extrabold text-[9px]">
                      ✶
                    </sup>
                  </FormLabel>
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
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                      className="flex items-center space-x-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="DOB"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password
                    <sup className="text-red-700 font-extrabold text-[9px]">
                      ✶
                    </sup>
                  </FormLabel>
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
                  <FormLabel>
                    Confirm Password
                    <sup className="text-red-700 font-extrabold text-[9px]">
                      ✶
                    </sup>
                  </FormLabel>
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
              "Register"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Register;
