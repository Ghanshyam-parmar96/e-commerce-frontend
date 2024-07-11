import { setCookies } from "@/action/authAction";
import { googleAuthSchema } from "@/schemas/auth-schema";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const obj: { [index: string]: any } = {};

  searchParams.forEach((value, key) => {
    if (key === "isAdmin" || key === "isVerified") {
      obj[key] = JSON.parse(value);
    } else {
      obj[key] = value;
    }
  });

  const validationResult = googleAuthSchema.safeParse(obj);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 }
    );
  }
  await setCookies(validationResult.data);
  return redirect("/");
}
