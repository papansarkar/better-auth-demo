import { ReturnButton } from "@/components/return-button"
import { SignOutButton } from "@/components/sign-out-button"
import { ProfileForm } from "@/components/profile-form"

export default function Page() {
 return (
  <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
    <div className="space-y-8">
      <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <ReturnButton href="/" label="Home"/>
      </div>
      
      <ProfileForm />
      
      <div className="pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
          <SignOutButton/>
      </div>
     </div>
  </div>
 )
}