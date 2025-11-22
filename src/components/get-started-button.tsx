"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { UserRole } from "@/lib/types";

export const GetStartedButton = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Button size="lg" className="opacity-50">
        Get Started
      </Button>
    );
  }

  const href = session ? "/profile" : "/auth/login";

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button size="lg" asChild>
        <Link href={href}>Get Started</Link>
      </Button>

      {session && (
        <p className="flex items-center justify-center gap-2">
          <span
            data-role={session.user.role} // convert numeric -> string key
            className="
              size-4 rounded-full animate-pulse
              data-[role=USER]:bg-blue-600
              data-[role=ADMIN]:bg-red-600
              data-[role=SUPER_ADMIN]:bg-purple-600
              data-[role=PUBLISHER]:bg-emerald-600
              data-[role=MODERATOR]:bg-yellow-600
              data-[role=EDITOR]:bg-pink-600
            "
          />
          Welcome back, {session.user.name}!
        </p>
      )}
    </div>
  );
};
