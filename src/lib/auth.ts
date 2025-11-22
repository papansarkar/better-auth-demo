import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { prisma } from "./prisma";
import { hashPassword, verifyPassword } from "./argon2";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware } from "better-auth/api";
import { normalizeName, VALID_DOMAIN } from "./utils";
import { UserRole } from "./types";
import { admin } from "better-auth/plugins";
import { ac, roles } from "./permission";

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
  databaseHooks: {
    user: {
      create: {
        before: async (user)=>{
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? []
          const SUPER_ADMIN_EMAILS = process.env.SUPER_ADMIN_EMAILS?.split(";") ?? []

          if(ADMIN_EMAILS.includes(user.email)){
            return {data: {...user, role: UserRole.ADMIN}}
          }

          if(SUPER_ADMIN_EMAILS.includes(user.email)){
            return {data: {...user, role: UserRole.SUPER_ADMIN}}
          }

          return {data: {...user, role: UserRole.USER}}
        }
      }
    }
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
  user: {
    additionalFields: {
      role: {
        type: [
          UserRole.USER,
          UserRole.ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.MODERATOR,
          UserRole.PUBLISHER,
          UserRole.EDITOR,
        ],
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  advanced: {
    database: {
      generateId: false,
    },
  },

  plugins: [nextCookies(), admin({
    ac,
    roles,
    defaultRole: UserRole.USER,
    superAdminRole: [UserRole.SUPER_ADMIN],
    adminRole: [UserRole.ADMIN],
    moderatorRole: [UserRole.MODERATOR],
    publisherRole: [UserRole.PUBLISHER],
    editorRole: [UserRole.EDITOR],
    superAdminEmails: process.env.SUPER_ADMIN_EMAILS?.split(";") ?? [],
    adminEmails: process.env.ADMIN_EMAILS?.split(";") ?? [],
    impersonationSessionDuration: 30 * 24 * 60 * 60,
  })],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
export type authType = typeof auth;
