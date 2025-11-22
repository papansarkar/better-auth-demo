import { ReturnButton } from "@/components/return-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostForm } from "@/components/post-form";
import { getPost } from "@/actions/post-actions";
import { redirect } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    return redirect("/auth/login");
  }

  let post = null;
  if (id !== "new") {
    post = await getPost(id);
    if (!post) {
        return (
          <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
             <ReturnButton href="/dashboard/posts" label="Back to Posts" />
             <div className="text-red-500">Post not found</div>
          </div>
        )
    }
    
    const isOwner = post.userId === session.user.id;
    const canEdit = isOwner || ["SUPER_ADMIN", "ADMIN"].includes(session.user.role || "");
    
    if (!canEdit) {
        return (
          <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
             <ReturnButton href="/dashboard/posts" label="Back to Posts" />
             <div className="text-red-500">You do not have permission to edit this post.</div>
          </div>
        )
    }
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between w-auto">
          <ReturnButton href="/dashboard/posts" label="Back to Posts" />
        </div>
        
        <h1 className="text-3xl font-bold">{id === "new" ? "Create Post" : "Edit Post"}</h1>
        <PostForm post={post} />
      </div>
    </div>
  );
}
