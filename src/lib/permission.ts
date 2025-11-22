import { UserRole } from "@/generated/prisma/enums"
import {createAccessControl} from "better-auth/plugins/access"
import {defaultStatements, adminAc} from "better-auth/plugins/admin/access"

const statements = {
 ...defaultStatements,
 posts: ["create", "read", "update", "delete", "update:own", "delete:own"],
 users: ["list", "create", "delete", "ban", "unban", "impersonate", "update"]
} as const


export const ac = createAccessControl(statements)

export const roles = {
 [UserRole.USER]: ac.newRole({
  posts: ["create","read", "update:own", "delete:own"]
 }),
 [UserRole.PUBLISHER]: ac.newRole({
  posts: ["create", "read", "update:own", "delete:own"]
 }),
 [UserRole.EDITOR]: ac.newRole({
  posts: ["read", "update", "delete"]
 }),
 [UserRole.MODERATOR]: ac.newRole({
  users: ["list", "ban", "unban"],
  posts: ["read"]
 }),
 [UserRole.ADMIN]: ac.newRole({
  ...adminAc.statements,
  users: ["list", "create", "delete", "ban", "unban", "impersonate", "update"],
  posts: ["create","read", "update", "delete", "update:own", "delete:own"]
 }),
 [UserRole.SUPER_ADMIN]: ac.newRole({
  ...adminAc.statements,
  users: ["list", "create", "delete", "ban", "unban", "impersonate", "update"],
  posts: ["create","read", "update", "delete", "update:own", "delete:own"]
 })
}