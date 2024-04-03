"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle, ModeToggleTG } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react";
import { login, fetchMe, logout } from '@/api/auth';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
import { getCart, createShoppingCart } from "@/api/cart";
import { usePathname, useSearchParams } from 'next/navigation'

export const Navbar = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [cartData, setCartData] = useState(null);
    const pathname = usePathname()

      useEffect(() => {
          const fetchData = async () => {
              try {
                const data = await fetchMe();
                console.log('User data:', data);
                if(typeof data === 'string' && data.includes("Request failed")) {
                  // router.push('/login');
                  console.log('pathname:', pathname);
                  if(pathname !== '/') router.push('/login');
                } else {
                  setUserData(data);
                }
              } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
              }
            };
        const fetchCartData = async () => {
            try {
                const data = await getCart();
                console.log('Cart data:', data);
                setCartData(data);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                const data = await createShoppingCart();
                console.log('Cart data:', data);
                setCartData(data);
            }
        }
        // fetchCartData(); 
        fetchData(); 
      }, []);
    const scrolled = useScrollTop();

    const handleLogout = async () => {
      try {
        await logout();
        console.log('Logged out');
        router.push('/login');
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    const cartSumQty = () => {
        let sum = 0;
        if (cartData !== null && cartData.cart_items !== undefined) {
            cartData.cart_items.map((item) => {
                sum += item.quantity;
            });
        }
        return sum;
    }

    return (
        <div className="flex-grow">
            <div className={cn(
                "z-50 bg-background fixed top-0 flex items-center w-full p-6",
                scrolled && "border-b shadow-sm"
            )}>
                <div className="ml-auto justify-start w-full flex items-center gap-x-2">
                  <a href="/">
                    <Logo /> 
                  </a>
                </div>
                <div className="ml-auto justify-end w-full flex items-center gap-x-2">
                  {/* <ModeToggle /> */}
                  <ModeToggleTG />
                  {userData ? (
                    <>
                    <Button size="icon" variant="outline" className="relative">
                      <Link href="/cart">
                        <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
                      </Link>
                      {/* Display the number of items
                      <span className="text-sm absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 rounded-full px-1 text-white">{cartData !== null ? cartSumQty(): 0}</span> */}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <div className="text-left">
                                    <p className="text-xs font-medium leading-none">
                                        Hello,
                                    </p>
                                    <p className="text-xs font-bold leading-none">
                                        {userData?.us_fname || 'loading...'}
                                    </p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end" forceMount>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link href="/profile">
                                    <DropdownMenuItem>
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/profile/address-book">
                                    <DropdownMenuItem>
                                        Address Book
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/profile/tracker">
                                    <DropdownMenuItem>
                                        Pizza Tracker
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleLogout()}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </>
                ) : (
                    <Link href="/login">
                        <Button variant="outline" size="default">Login</Button>
                    </Link>
                )}
                </div>
            </div>
        </div>
   )
}