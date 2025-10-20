"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpenIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PinIcon,
  SearchIcon,
  SettingsIcon,
  UserPenIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

type UserMenuProps = {
  name: string;
  email: string;
  image: string;
}

export default function UserMenu({ name, email, image }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();


  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Logout failed");
      } else {
        // Clear any local state
        // Force a full page reload to ensure all components re-render
        window.location.href = '/';
        toast.success("Logged out successfully");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  // if (loading || !userData) {
  //   return (
  //     <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
  //   );
  // }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-10">
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback className="text-md bg-gray-100">
              {name.split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutDashboardIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/search" className="flex items-center">
              <SearchIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Search Documents</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/bookmarks" className="flex items-center">
              <PinIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Bookmarks</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <SettingsIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <UserPenIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
              <span>Edit Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOutIcon size={16} className="opacity-60 mr-2" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
