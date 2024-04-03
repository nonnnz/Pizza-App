"use client";

import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const Success = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderid = searchParams.get('orderid')
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)

    useEffect(() => {
    console.log('Order ID:', orderid);
    if(orderid) setIsOrderPlaced(true)
  }, [orderid]);


    return ( <div className="h-full flex flex-col  items-center space-y-4 p-8 md:flex">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold first:mt-0 text-green-600 dark:text-green-200">
        success
            </h2>
            {isOrderPlaced ? ( <>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                Your order has been placed successfully. Your order ID is {orderid}.
            </p>
            <Link href={`/profile/tracker?orderid=${orderid}`}>
                <Button variant="default">
                    Track your order
                </Button>
            </Link>
            </>
              ): <> </>}

    </div> );
}
 
export default Success;