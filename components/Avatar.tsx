"use client";

// import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut,  } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function UserAvatar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  // Show sign in button if not authenticated
  if (!session) {
    return (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignIn}
        >
          Sign In
        </Button>
        <Button
          size="sm"
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  // Show user avatar and dropdown if authenticated
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage 
            src="" 
            alt="User" 
          />
          <AvatarFallback>
            {session.user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white text-black dark:bg-black dark:text-white border dark:border-neutral-800 shadow-md w-58 "
      >
        <div className="px-2 py-1.5 text-sm font-medium">
          {session.user?.email || "User"}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-500 hover:text-white focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
