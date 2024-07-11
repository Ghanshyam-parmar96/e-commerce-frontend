import { NextRequest, NextResponse } from "next/server";
import { auth, updateSession } from "@/lib/useAuth";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "@/routes";

export const middleware = async (request: NextRequest) => {
  const { isAdmin, isLoggedIn } = await auth(request);

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
  const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (!isLoggedIn) {
    if (isAuthRoute || isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  if (!isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  return await updateSession(request);
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
