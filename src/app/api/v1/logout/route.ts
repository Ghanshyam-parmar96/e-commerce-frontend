"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  cookies().delete("currentUser");
  return redirect("/auth/login");
}
