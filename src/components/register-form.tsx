"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signUp } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(event.target as HTMLFormElement);

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    await signUp.email(
      {
        name: name.toString().trim(),
        email: email.toString().trim(),
        password: password.toString().trim(),
      },
      {
        onRequest: () => {setIsPending(true)},
        onSuccess: () => {
          toast.success("Registration successful!");
          router.push("/auth/login")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          console.error(ctx.error.message)
        },
        onResponse: () => {setIsPending(false)},
      }
    );
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </Label>

        <Input id="name" name="name" />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </Label>

        <Input id="email" name="email" type="email" />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </Label>

        <Input id="password" name="password" type="password" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        Register
      </Button>
    </form>
  );
};
