"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getPosts() {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) return []

  const role = session.user.role
  const isUser = role === "USER"

  const where = isUser ? { userId: session.user.id } : {}
  
  const posts = await prisma.post.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return posts
}

export async function getPost(id: string) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) return null

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  })

  return post
}

export async function createPost(data: { title: string; content: string }) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) {
    return { error: "Unauthorized" }
  }

  // Check if user can create posts (USER role has 'create')
  // We could be more strict here if needed, but schema allows USER to create.

  try {
    await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        userId: session.user.id
      }
    })
    revalidatePath("/dashboard/posts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create post" }
  }
}

export async function updatePost(id: string, data: { title: string; content: string }) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) {
    return { error: "Unauthorized" }
  }

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return { error: "Post not found" }

  const isOwner = post.userId === session.user.id
  const role = session.user.role
  const canUpdateAll = ["SUPER_ADMIN", "ADMIN"].includes(role || "")
  
  if (!isOwner && !canUpdateAll) {
    return { error: "Forbidden" }
  }

  try {
    await prisma.post.update({
      where: { id },
      data
    })
    revalidatePath("/dashboard/posts")
    revalidatePath(`/dashboard/posts/${id}`)
    return { success: true }
  } catch (error) {
    return { error: "Failed to update post" }
  }
}

export async function deletePost(id: string) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) {
    return { error: "Unauthorized" }
  }

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return { error: "Post not found" }

  const isOwner = post.userId === session.user.id
  const role = session.user.role
  const canDeleteAll = ["SUPER_ADMIN", "ADMIN"].includes(role || "")
  
  if (!isOwner && !canDeleteAll) {
    return { error: "Forbidden" }
  }

  try {
    await prisma.post.delete({
      where: { id }
    })
    revalidatePath("/dashboard/posts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete post" }
  }
}

export async function togglePostStatus(id: string, field: "published" | "featured") {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!session) {
    return { error: "Unauthorized" }
  }

  const role = session.user.role
  const canPublish = ["SUPER_ADMIN", "ADMIN", "PUBLISHER", "MODERATOR"].includes(role || "")
  const canFeature = ["SUPER_ADMIN", "ADMIN", "PUBLISHER"].includes(role || "")

  if (field === "published" && !canPublish) return { error: "Forbidden" }
  if (field === "featured" && !canFeature) return { error: "Forbidden" }

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return { error: "Post not found" }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        [field]: !post[field as keyof typeof post]
      }
    })
    revalidatePath("/dashboard/posts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update post status" }
  }
}
