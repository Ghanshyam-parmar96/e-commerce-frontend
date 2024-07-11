"use server";

import { encrypt } from "@/lib/useAuth";
import {
  AccountVerificationSchema,
  ForgotPasswordSchema,
  GenerateNewPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@/schemas/auth-schema";
import { format } from "date-fns";
import { cookies } from "next/headers";
import * as z from "zod";

interface loginActionReturn {
  message: string;
  success: boolean;
  isAdmin: boolean;
}

interface responseData {
  _id: string;
  fullName: string;
  email: string;
  avatar: string;
  isAdmin: boolean;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export const setCookies = async (data: responseData) => {
  const user = await encrypt({
    userId: data._id,
    fullName: data.fullName,
    email: data.email,
    avatar: data.avatar,
    isAdmin: data.isAdmin,
    isVerified: data.isVerified,
  });

  // Save the session in a cookie
  const today = new Date();
  const accessTokenExpiry = new Date().setDate(today.getDate() + 1); // next day
  const refreshTokenExpiry = new Date().setDate(today.getDate() + 5); // next 5 days

  cookies().set({
    name: "accessToken",
    value: data.accessToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: accessTokenExpiry,
  });

  cookies().set({
    name: "refreshToken",
    value: data.refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: refreshTokenExpiry,
  });

  cookies().set({
    name: "currentUser",
    value: user,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: refreshTokenExpiry,
  });
};

const fetchData = async (
  url: string,
  data: any
): Promise<{ statusCode: number; data: any; message: string }> => {
  const req = await fetch(`${process.env.BACKEND_URI}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
    cache: "no-store",
  });
  return req.json();
};

export const loginAction = async (
  data: z.infer<typeof LoginSchema>
): Promise<loginActionReturn> => {
  try {
    const result = await fetchData(`user/log-in`, data);

    if (result.statusCode !== 200) {
      return {
        message: result.message,
        success: false,
        isAdmin: false,
      };
    }

    await setCookies(result.data);

    return {
      message: "Logged in successfully",
      success: true,
      isAdmin: result.data.isAdmin,
    };
  } catch (error: any) {
    return {
      message: "Failed to login try again later",
      success: false,
      isAdmin: false,
    };
  }
};

interface BaseQuery {
  fullName: string;
  email: string;
  password: string;
  DOB?: string;
  gender?: string;
}

interface RegisterActionReturn extends Omit<loginActionReturn, "isAdmin"> {
  userId: string;
}
export const registerAction = async (
  data: z.infer<typeof RegisterSchema>
): Promise<RegisterActionReturn> => {
  const baseQuery: BaseQuery = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
  };

  if (data.DOB) baseQuery.DOB = format(data.DOB, "yyyy-MM-dd");
  if (data.gender) baseQuery.gender = data.gender;

  try {
    const result = await fetchData(`user/new`, baseQuery);

    if (result.statusCode !== 201) {
      return {
        message: result.message,
        success: false,
        userId: result.data,
      };
    }

    return {
      message: result.message,
      success: true,
      userId: result.data,
    };
  } catch (error) {
    return {
      message: "Failed to register, try again later",
      success: false,
      userId: "",
    };
  }
};

type verifyAccountActionReturn = Omit<loginActionReturn, "isAdmin">;
export const verifyAccountAction = async (
  data: z.infer<typeof AccountVerificationSchema>,
  id: string
): Promise<verifyAccountActionReturn> => {
  try {
    const result = await fetchData(`user/me/verify/${id}`, {
      verifyCode: Number(data.verifyCode),
    });

    if (result.statusCode !== 200) {
      return {
        message: result.message,
        success: false,
      };
    }

    await setCookies(result.data);

    return {
      message: result.message,
      success: true,
    };
  } catch (error) {
    return {
      message: "Failed to verify Account",
      success: false,
    };
  }
};

type resendEmailOtpReturn = verifyAccountActionReturn;
export const resendEmailOtp = async (
  id: string
): Promise<resendEmailOtpReturn> => {
  try {
    const resend = await fetch(
      `${process.env.BACKEND_URI}/user/me/resend-otp/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      }
    );
    const result = await resend.json();

    if (!resend.ok) {
      return {
        message: result.message,
        success: false,
      };
    }

    return {
      message: result.message,
      success: true,
    };
  } catch (err) {
    return {
      message: "Failed to resend email OTP",
      success: false,
    };
  }
};

type forgotPasswordActionReturn = RegisterActionReturn;
export const forgotPasswordAction = async (
  data: z.infer<typeof ForgotPasswordSchema>
): Promise<forgotPasswordActionReturn> => {
  try {
    const result = await fetchData("user/me/forgot-password", {
      email: data.email,
    });

    if (result.statusCode !== 200) {
      return {
        message: result.message,
        success: false,
        userId: "",
      };
    }

    return {
      message: result.message,
      success: true,
      userId: result.data,
    };
  } catch (error) {
    return {
      message: "Failed to reset password, try again later",
      success: false,
      userId: "",
    };
  }
};

type generateNewPasswordActionReturn = RegisterActionReturn;
export const generateNewPasswordAction = async (
  data: z.infer<typeof GenerateNewPasswordSchema>,
  id: string
): Promise<generateNewPasswordActionReturn> => {
  try {
    const result = await fetchData(`user/me/reset-password/${id}`, {
      newPassword: data.password,
      resetPasswordToken: Number(data.verifyCode),
    });

    if (result.statusCode !== 200) {
      return {
        message: result.message,
        success: false,
        userId: "",
      };
    }

    return {
      message: result.message,
      success: true,
      userId: result.data,
    };
  } catch (error) {
    return {
      message: "Failed to generate new password, try again later",
      success: false,
      userId: "",
    };
  }
};

type resetPasswordActionReturn = verifyAccountActionReturn;
export const resetPasswordAction = async (
  data: z.infer<typeof ResetPasswordSchema>
): Promise<resetPasswordActionReturn> => {
  try {
    const result = await fetchData("user/me/change-password", {
      oldPassword: data.oldPassword,
      newPassword: data.password,
    });

    if (result.statusCode !== 200) {
      return {
        message: result.message,
        success: false,
      };
    }

    return {
      message: result.message,
      success: true,
    };
  } catch (error) {
    return {
      message: "Failed to reset password, try again later",
      success: false,
    };
  }
};
