"use client"


import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { prisma } from "@/lib/prisma";
import { useState } from "react";
import { deleteUserAction } from "@/actions/delete-user-action";
import { toast } from "sonner";

interface DeleteUserButtonProps{
 userId: string;
}


export const DeleteUserButton = ({userId}: DeleteUserButtonProps) => {
 const [isPending, setIsPending] = useState(false)
 async function handleClick () {
	setIsPending(true)

	const {error, redirect} = await deleteUserAction({userId})
	setIsPending(false)

	if(error){
		toast.error(error)
	} else {
		toast.success("User deleted successfully!")
	}

	if(redirect){
		window.location.href = redirect
		return
	}
 }
   return <Button
     size={"icon"}
     variant={"destructive"}
     className="size-8 rounded-sm"
     onClick={handleClick}
    >
     <span className="sr-only">Delete user</span>
     <Trash2 className="h-4 w-4" />
    </Button>
}

export const PlaceHolderDeleteUserButton = () => {
 return <Button
     size={"icon"}
     variant={"destructive"}
     className="size-8 rounded-sm"
     disabled
    >
     <span className="sr-only">Delete user</span>
     <Trash2 className="h-4 w-4" />
    </Button>
}