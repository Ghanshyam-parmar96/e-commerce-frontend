import { NextRequest, NextResponse } from "next/server";
import { authRoutes, publicRoutes, DEFAULT_LOGIN_REDIRECT } from "@/routes";

const middleware = (request: NextRequest) => {
  const { nextUrl } = request;
  const isAuth =
    request.cookies.has("isAuth") &&
    JSON.parse(request.cookies.get("isAuth")?.value as string);

  const isLoggedIn = isAuth && isAuth.loggedOutDate > new Date().valueOf();

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return null;
};

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default middleware;
