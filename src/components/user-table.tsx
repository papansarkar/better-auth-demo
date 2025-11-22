"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserActionsMenu } from "./user-actions-menu"
import { User } from "better-auth/types"
import { useSession } from "@/lib/auth-client"
import clsx from "clsx"

interface UserTableProps {
  users: (User & { role?: string; banned?: boolean })[]
}

export function UserTable({ users }: UserTableProps) {
  const {data: session} = useSession()
  const currentUserId = session?.user.id
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className={clsx(currentUserId===user.id && "bg-muted/60")}>
              <TableCell>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={
                  user.role === "SUPER_ADMIN" ? "destructive" :
                  user.role === "ADMIN" ? "default" :
                  user.role === "MODERATOR" ? "secondary" :
                  "outline"
                }>
                  {user.role || "USER"}
                </Badge>
              </TableCell>
              <TableCell>
                {user.banned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <UserActionsMenu user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
