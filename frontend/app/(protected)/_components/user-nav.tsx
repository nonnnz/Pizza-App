"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRoundCog } from "lucide-react"
import { login, fetchMe, logout } from '@/api/auth';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export function UserNav() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const data = await fetchMe();
              console.log('User data:', data);
              setUserData(data);
              if (data.us_role === 'USER') {
                router.push('/'); 
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              router.push('/login');
            }
          };
      
          fetchData(); // Call the async function
    }, []);

    const handleLogout = async () => {
        try {
          await logout();
          console.log('Logged out');
          router.push('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
    }
    

    return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
            <UserRoundCog className="h-4 w-4" />
            {/* <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
                Hi, {userData?.us_fname} {userData?.us_lname || 'loading...'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
                {userData?.us_email || 'loading...'}
            </p>
            </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={() => handleLogout()}>
            Log out
            {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    );
}