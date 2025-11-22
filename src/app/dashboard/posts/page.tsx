import { ReturnButton } from "@/components/return-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostTable } from "@/components/post-table";
import { getPosts } from "@/actions/post-actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PostsPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    return redirect("/auth/login");
  }

  const posts = await getPosts();

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between w-auto">
          <ReturnButton href="/dashboard" label="Back to Dashboard" />
          <Link href="/dashboard/posts/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold">Posts</h1>
        <PostTable posts={posts} />
      </div>
    </div>
  );
}
