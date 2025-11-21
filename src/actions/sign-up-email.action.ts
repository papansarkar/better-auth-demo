"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function signUpEmailAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!name || !email || !password) {
    return {
      error: "Please fill in all fields.",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      const errCode = err.body ? (err.body.code as ErrorCode) : "UNKNOWN";

      switch (errCode) {
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return {
            error: "hey, come on buddy!",
          };
        case "PASSWORD_TOO_SHORT":
          return {
            error: "hey, short of char to choose?",
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
