import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./argon2";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { normalizeName, VALID_DOMAIN } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = String(ctx.body.email);
        const domain = email.split("@")[1];

        if (!VALID_DOMAIN().includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid domain. Please use a valid email address.",
          });
        }

        const name = normalizeName(ctx.body.name);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },

  plugins: [nextCookies()],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
export type authType = typeof auth;
