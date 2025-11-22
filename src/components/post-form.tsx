"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createPost, updatePost } from "@/actions/post-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function PostForm({ post }: { post?: any }) {
  const [title, setTitle] = useState(post?.title || "")
  const [content, setContent] = useState(post?.content || "")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      
      const data = { title, content }
      let res;
      
      if (post) {
          res = await updatePost(post.id, data)
      } else {
          res = await createPost(data)
      }

      setIsLoading(false)

      if (res.error) {
          toast.error(res.error)
      } else {
          toast.success(post ? "Post updated" : "Post created")
          router.push("/dashboard/posts")
          router.refresh()
      }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Enter post title" />
          </div>
          <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea 
                id="content" 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required 
                placeholder="Write your post content here..."
              />
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : (post ? "Update Post" : "Create Post")}
            </Button>
          </div>
      </form>
  )
}
