"use client";

import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";



export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">      
      <div className="min-h-screen flex justify-center">
        <ModeToggle />
        <p>ERROR 404: Page not found</p>
      </div>
    </main>
  );
}
