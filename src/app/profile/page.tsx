import { ReturnButton } from "@/components/return-button";
import { SignOutButton } from "@/components/sign-out-button";
import { ProfileForm } from "@/components/profile-form";

export default function Page() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex items-center justify-between">
          <ReturnButton href="/" label="Home" />
          <ReturnButton
            href="/dashboard"
            label="ADMIN DASHBOARD"
            isLeftIcon={false}
            variant={"outline"}
            className="bg-red-600"
          />
        </div>

        <ProfileForm />

        <div className="pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
