"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";
import { FormSeparator } from "@/components/ui/form-separator";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export default function CardWrapper({
  children,
  backButtonHref,
  backButtonLabel,
  headerLabel,
  showSocial,
}: CardWrapperProps) {
  return (
    <Card className="w-96 shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="pb-3">{children}</CardContent>
      <FormSeparator label="Or continue with" />
      {showSocial && (
        <CardFooter className="pt-2">
          <Social label="Login with Google" />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          href={backButtonHref}
          label={backButtonLabel}
        />
      </CardFooter>
    </Card>
  );
}
