import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_TOKEN_KEY;
const key = new TextEncoder().encode(secretKey);

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isVerified: boolean;
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Destroy the session
export const logout = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  cookies().delete("currentUser");
};

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next();
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;
  // return res;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken) {
    res.headers.set("accessToken", accessToken);
    return res;
  }

  // if access token doesn't expire

  const renewToken = await fetch(
    `${process.env.BACKEND_URI}/user/renew-token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: refreshToken,
      },
      cache: "no-store",
      credentials: "include",
    }
  );
  const result = await renewToken.json();
  console.log("generate new access token and refresh token", result);

  if (!renewToken.ok) {
    const logout = await (await fetch("/api/v1/logout")).json();
    return;
  }

  const user = await encrypt({
    userId: result.data._id,
    fullName: result.data.fullName,
    email: result.data.email,
    avatar: result.data.avatar,
    isAdmin: result.data.isAdmin,
    isVerified: result.data.isVerified,
  });

  // Save the session in a cookie
  const today = new Date();
  const accessTokenExpiry = new Date().setDate(today.getDate() + 1); // next day
  const refreshTokenExpiry = new Date().setDate(today.getDate() + 5); // next 5 days

  res.cookies.set({
    name: "accessToken",
    value: result.data.accessToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: accessTokenExpiry,
  });

  res.cookies.set({
    name: "refreshToken",
    value: result.data.refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: refreshTokenExpiry,
  });

  res.cookies.set({
    name: "currentUser",
    value: user,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: refreshTokenExpiry,
  });

  res.headers.set("accessToken", result.data.accessToken);
  return res;
}

export const currentUser = async (): Promise<IUser | null> => {
  const session = cookies().get("currentUser")?.value;
  if (!session) return null;
  return await decrypt(session);
};

export const getToken = () => {
  return headers().get("accessToken");
};

export const getAuthStatus = () => {
  return cookies().has("accessToken");
};

export const auth = async (req: NextRequest) => {
  const refreshToken = req.cookies.has("refreshToken");
  const user = await currentUser();

  return {
    isLoggedIn: refreshToken,
    isAdmin: user?.isAdmin ?? false,
  };
};

export const ClientSignedOut = () => {
  const session = cookies().has("accessToken");
  // return !session ? children : null;
  return session;
};
