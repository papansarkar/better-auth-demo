"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="sticky top-0 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          Better Auth Demo
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium hover:underline"
              >
                Profile
              </Link>
              <Button
                variant="outline"
                onClick={async () => {
                  await signOut();
                  router.push("/auth/login");
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
