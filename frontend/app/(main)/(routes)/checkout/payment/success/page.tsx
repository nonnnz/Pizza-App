"use client";

import { useSearchParams } from 'next/navigation'

import { useEffect } from "react";

const Success = () => {
    const searchParams = useSearchParams()

    const orderid = searchParams.get('orderid')

    useEffect(() => {
    console.log('Order ID:', orderid);
  }, [orderid]);


    return ( <div>
        <h1>Success</h1>
    </div> );
}
 
export default Success;