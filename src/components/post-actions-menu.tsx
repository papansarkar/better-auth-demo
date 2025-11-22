"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Edit, Eye, EyeOff, Star, StarOff } from "lucide-react"
import { deletePost, togglePostStatus } from "@/actions/post-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function PostActionsMenu({ post }: { post: any }) {
  const router = useRouter()
  const session = authClient.useSession()
  
  if (!session.data) return null

  const user = session.data.user
  const isOwner = post.userId === user.id
  const role = user.role
  const canDelete = isOwner || ["SUPER_ADMIN", "ADMIN"].includes(role || "")
  const canEdit = isOwner || ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role || "")
  const canPublish = ["SUPER_ADMIN", "ADMIN", "PUBLISHER", "MODERATOR"].includes(role || "")
  const canFeature = ["SUPER_ADMIN", "ADMIN", "PUBLISHER"].includes(role || "")

  const handleDelete = async () => {
      if(!confirm("Are you sure you want to delete this post?")) return
      const res = await deletePost(post.id)
      if(res.error) toast.error(res.error)
      else {
          toast.success("Post deleted successfully")
          router.refresh()
      }
  }

  const handleToggleStatus = async (field: "published" | "featured") => {
      const res = await togglePostStatus(post.id, field)
      if(res.error) toast.error(res.error)
      else {
          toast.success(`Post ${field} status updated`)
          router.refresh()
      }
  }

  if (!canDelete && !canEdit && !canPublish && !canFeature) return null

  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              {canEdit && (
                  <DropdownMenuItem onClick={() => router.push(`/dashboard/posts/${post.id}`)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
              )}
              
              {(canPublish || canFeature) && <DropdownMenuSeparator />}

              {canPublish && (
                  <DropdownMenuItem onClick={() => handleToggleStatus("published")}>
                      {post.published ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                      {post.published ? "Unpublish" : "Publish"}
                  </DropdownMenuItem>
              )}

              {canFeature && (
                  <DropdownMenuItem onClick={() => handleToggleStatus("featured")}>
                      {post.featured ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                      {post.featured ? "Unfeature" : "Feature"}
                  </DropdownMenuItem>
              )}

              {(canPublish || canFeature) && <DropdownMenuSeparator />}

              {canDelete && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
              )}
          </DropdownMenuContent>
      </DropdownMenu>
  )
}
