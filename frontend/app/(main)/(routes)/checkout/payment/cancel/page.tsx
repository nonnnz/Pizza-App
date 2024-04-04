"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Cancel = () => {
    return ( <div>
        <h1>Cancel</h1>
        <p>Your payment has been cancelled.</p>
        <Link href="/checkout">
            <Button variant="default" className=" bg-red-600 dark:bg-red-300">Go back to checkout</Button>
        </Link>
    </div> );
}
 
export default Cancel;