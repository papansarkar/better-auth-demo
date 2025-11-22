"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Ban, UserCheck, UserCog, LogIn } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "better-auth/types"

interface UserActionsMenuProps {
  user: User & { role?: string; banned?: boolean };
}

export function UserActionsMenu({ user }: UserActionsMenuProps) {
  const router = useRouter()
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [banReason, setBanReason] = useState("")
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(user.role || "USER")
  const [isLoading, setIsLoading] = useState(false)

  const session = authClient.useSession()
  const currentUserRole = session.data?.user?.role

  const handleBanUser = async () => {
    setIsLoading(true)
    await authClient.admin.banUser({
      userId: user.id,
      banReason: banReason,
    }, {
      onSuccess: () => {
        toast.success("User banned successfully")
        setIsBanDialogOpen(false)
        router.refresh()
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    })
    setIsLoading(false)
  }

  const handleUnbanUser = async () => {
    setIsLoading(true)
    await authClient.admin.unbanUser({
      userId: user.id,
    }, {
      onSuccess: () => {
        toast.success("User unbanned successfully")
        router.refresh()
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    })
    setIsLoading(false)
  }

  const handleDeleteUser = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return
    setIsLoading(true)
    await authClient.admin.removeUser({
      userId: user.id,
    }, {
      onSuccess: () => {
        toast.success("User deleted successfully")
        router.refresh()
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    })
    setIsLoading(false)
  }

  const handleImpersonateUser = async () => {
    setIsLoading(true)
    await authClient.admin.impersonateUser({
      userId: user.id,
    }, {
      onSuccess: () => {
        toast.success("Impersonating user...")
        router.push("/")
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    })
    setIsLoading(false)
  }

  const handleChangeRole = async () => {
    setIsLoading(true)
    await authClient.admin.setRole({
      userId: user.id,
      role: selectedRole as any
    }, {
      onSuccess: () => {
        toast.success("User role updated successfully")
        setIsRoleDialogOpen(false)
        router.refresh()
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    })
    setIsLoading(false)
  }

  // Permission checks
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN"
  const isAdmin = currentUserRole === "ADMIN"
  const isModerator = currentUserRole === "MODERATOR"
  const isSelf = session.data?.user?.id === user.id
  const isTargetSuperAdmin = user.role === "SUPER_ADMIN"

  // Super Admins can do everything EXCEPT to other Super Admins
  const canDelete = (isSuperAdmin && !isTargetSuperAdmin) || (isAdmin && user.role === "USER")
  const canBan = ((isSuperAdmin && !isTargetSuperAdmin) || (isAdmin && user.role === "USER") || (isModerator && user.role === "USER")) && !isSelf
  const canImpersonate = isSuperAdmin && !isTargetSuperAdmin && !isSelf
  const canChangeRole = (isSuperAdmin && !isTargetSuperAdmin) || (isAdmin && user.role !== "SUPER_ADMIN" && user.role !== "ADMIN")

  if (!canDelete && !canBan && !canImpersonate && !canChangeRole) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
            Copy User ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {canImpersonate && (
            <DropdownMenuItem onClick={handleImpersonateUser}>
              <LogIn className="mr-2 h-4 w-4" />
              Impersonate
            </DropdownMenuItem>
          )}

          {canChangeRole && (
            <DropdownMenuItem onClick={() => setIsRoleDialogOpen(true)}>
              <UserCog className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
          )}

          {canBan && !user.banned && (
            <DropdownMenuItem onClick={() => setIsBanDialogOpen(true)}>
              <Ban className="mr-2 h-4 w-4" />
              Ban User
            </DropdownMenuItem>
          )}

          {canBan && user.banned && (
            <DropdownMenuItem onClick={handleUnbanUser}>
              <UserCheck className="mr-2 h-4 w-4" />
              Unban User
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem onClick={handleDeleteUser} className="text-red-600 focus:text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Are you sure you want to ban this user? They will not be able to log in.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Reason
              </Label>
              <Input
                id="reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="col-span-3"
                placeholder="Violation of terms..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBanUser} disabled={isLoading}>
              {isLoading ? "Banning..." : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a new role for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="PUBLISHER">PUBLISHER</option>
                <option value="EDITOR">EDITOR</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleChangeRole} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
