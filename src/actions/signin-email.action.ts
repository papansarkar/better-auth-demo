"use server";

import { parseSetCookieHeader } from "better-auth/cookies";
import { cookies, headers } from "next/headers";
import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function signInEmailAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return {
      error: "Please fill in all fields.",
    };
  }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: {
        email,
        password,
      },
      // asResponse: true,
    });

    //===
    // const setCookieHeader = res.headers.get("set-cookie");
    // if (setCookieHeader) {
    //   const cookie = parseSetCookieHeader(setCookieHeader);
    //   const cookieStore = await cookies();

    //   const [key, cookieAttr] = [...cookie.entries()][0];
    //   const value = cookieAttr.value;
    //   const maxAge = cookieAttr["max-age"];
    //   const path = cookieAttr.path;
    //   const httpOnly = cookieAttr.httponly;
    //   const sameSite = cookieAttr.samesite;

    //   cookieStore.set(key, decodeURIComponent(value), {
    //     maxAge,
    //     path,
    //     httpOnly,
    //     sameSite,
    //   });
    // }

    //===
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return {
            error: "hey, come on buddy!",
          };
        case "INVALID_EMAIL_OR_PASSWORD":
          return {
            error: "hey, are you sure ?",
          };
        default:
          return {
            error:
              err.message || "Oops! Something went wrong while registering!",
          };
      }
    }

    return {
      error: "Internal Server Error",
    };
  }
}
