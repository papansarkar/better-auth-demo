import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PostActionsMenu } from "./post-actions-menu"
import { Badge } from "@/components/ui/badge"

export function PostTable({ posts }: { posts: any[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.user?.name || "Unknown"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {post.featured && <Badge variant="secondary">Featured</Badge>}
                    {!post.published && <Badge variant="outline">Draft</Badge>}
                    {post.published && !post.featured && <Badge variant="outline" className="border-transparent">Published</Badge>}
                  </div>
                </TableCell>
                <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <PostActionsMenu post={post} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
