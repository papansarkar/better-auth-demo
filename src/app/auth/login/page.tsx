import { LoginForm } from "@/components/login-form";

export default function page(){
 return (
 <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
  <div className="space-y-8">
   <h1 className="text-3xl font-bold">Login</h1>
	 <LoginForm/>
  </div>
 </div>)
}
