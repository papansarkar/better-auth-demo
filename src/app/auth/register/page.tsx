import { RegisterForm } from "@/components/register-form";
import Link from "next/link";

export default function Page() {
    return <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
     <div className="space-y-8">
      <h1 className="text-3xl font-bold">Register</h1>
      <RegisterForm />
      <p className="text-muted-foreground text-sm">Already have an account? <Link href="/auth/login">Login</Link></p>
     </div>
    </div>
} 