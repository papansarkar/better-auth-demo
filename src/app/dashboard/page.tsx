import { ReturnButton } from "@/components/return-button";
import { SignOutButton } from "@/components/sign-out-button";

export default function page(){
 return (
 <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
  <div className="space-y-8">
   <div className="flex items-center justify-between w-auto">
    <ReturnButton href="/" label="Home"/>
   </div>
   <h1 className="text-3xl font-bold">Dashboard</h1>
  </div>
 </div>)
}