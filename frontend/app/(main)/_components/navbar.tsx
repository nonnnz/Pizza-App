"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle, ModeToggleTG } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { Menu, X, ChevronDown} from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
    const scrolled = useScrollTop();

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
                  <Link href="/login">
                  <Button variant="outline" size="default">Login
                  </Button>
                  </Link>
                </div>
            </div>
        </div>
   )
}