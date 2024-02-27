"use client";

import Link from "next/link";


import { ModeToggle } from "@/components/mode-toggle";
import { Button } from '@mantine/core';

import { useState } from "react";

export const Navbar = () => {
  // Check if the browser supports prefers-color-scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('Dark mode is preferred.');
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
  console.log('Light mode is preferred.');
} else {
  console.log('No specific color scheme preference detected.');
}

    return ( 
      // dark:bg-[#191919]
        <nav className="fixed top-0 w-full z-50 shadow-md ">
            <div className="flex justify-between items-center px-4 py-2">

                    <a className="text-xl font-bold">Next.js</a>

                <div className="flex items-center gap-2">
                    <Button variant="default">Button</Button>
          
                    <ModeToggle />
                </div>
            </div>
        </nav>
     )
}