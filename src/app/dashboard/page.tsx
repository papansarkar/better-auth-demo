
import { ReturnButton } from "@/components/return-button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserTable } from "@/components/user-table";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    return redirect("/auth/login");
  }

  const role = session.user.role;
  const canListUsers = ["SUPER_ADMIN", "ADMIN", "MODERATOR"].includes(role || "");

  let users: any[] = [];
  if (canListUsers) {
    try {
      const res = await auth.api.listUsers({
        headers: headersList,
        query: {
          sortBy: "name"
        }
      });
      users = res.users;
    } catch (error) {
      console.error("Failed to list users", error);
    }
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between w-auto">
          <ReturnButton href="/" label="Home" />
          <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground">Role: <span className="font-bold text-foreground">{role.split("_").join(" ").toUpperCase()}</span></span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/dashboard/posts" className="block">
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Manage Posts</div>
                        <p className="text-xs text-muted-foreground">Create, view and edit posts</p>
                    </CardContent>
                </Card>
            </Link>
            
            {canListUsers && (
              <div className="block">
                <Card className="h-full bg-muted/20 border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Total users registered</p>
                    </CardContent>
                </Card>
              </div>
            )}
        </div>

        {canListUsers ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <UserTable users={users} />
          </div>
        ) : (
          <div className="p-4 border rounded bg-muted/50">
            <p className="text-muted-foreground">You do not have permission to view users.</p>
          </div>
        )}
      </div>
    </div>
  );
}
