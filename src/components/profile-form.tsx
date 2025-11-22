"use client";

import { useState, useEffect } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoaderButton } from "./loader-button";

export function ProfileForm() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const user = session.user;
  const hasChanges = name !== (user.name || "") || image !== (user.image || "");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!hasChanges) return;

    setLoading(true);
    setStatus("loading");
    try {
      await authClient.updateUser({
        name,
        image,
      });
      toast.success("Profile updated successfully");
      setStatus("success");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name || "");
    setImage(user.image || "");
  };

  return (
    <div className="space-y-6 max-w-md">
      <div className="flex items-center gap-4">
        {/* Avatar Preview */}
        <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-muted">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              {name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium">{name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Profile Image URL</Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            disabled={!isEditing}
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          {!isEditing ? (
            <LoaderButton
              variant="smart"
              status={status}
              type="button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </LoaderButton>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-full"
              >
                Cancel
              </Button>
              <LoaderButton
                variant="smart"
                status={status}
                type="submit"
                disabled={loading || !hasChanges}
              >
                {status === "idle" && "Edit"}
                {status === "loading" && "Editing"}
                {status === "success" && "Saved"}
              </LoaderButton>
            </>
          )}
        </div>
      </form>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
