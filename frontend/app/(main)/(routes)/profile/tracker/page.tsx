"use client";

import { useSearchParams } from 'next/navigation'

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { getOrder } from '@/api/order';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { fetchMe } from '@/api/auth';

const Tracker = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderid = searchParams.get('orderid')
    const [isOrderPlaced, setIsOrderPlaced] = useState(true)
    const [orderData, setOrderData] = useState();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
    console.log('Order ID:', orderid);
    // if(orderid) {
    //     getOrder(orderid).then(data => {
    //         console.log('Order data:', data);
    //         setOrderData(data);
    //     }).catch(error => {
    //         console.error('Error fetching order data:', error);
    //     });
    // }
    // if(orderid) setIsOrderPlaced(true)
    const fetchData = async () => {
        try {
          const data = await fetchMe();
          console.log('User data:', data);
          if(typeof data === 'string' && data.includes("Request failed")) {
            // router.push('/login');
          } else {
            // setIsOrderPlaced(true)
            data.orders.reverse();
            setUserData(data);
            console.log('User data2:', data.user_id);
            const Id = (data.user_id).toString();
            const getallorder = await getOrder(Id);
            console.log('Order data:', getallorder);
            setOrderData(getallorder); 
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/login');
        }
      };
      fetchData();


  }, []);


    return ( <div className="h-full flex flex-col  items-center space-y-4 p-8 md:flex">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold first:mt-0">
        Tracker Orders
            </h2>
            {isOrderPlaced ? ( <>
            {userData && userData.orders  ? userData.orders.map((order) => (
                <Card key={order.order_id}>
                    <CardHeader>
                        <CardTitle>order Id:{order.order_id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {order.order_status === 'DELIVERED' ? <p className="text-lg text-green-600 dark:text-green-200">
                            Your order has been delivered.
                            </p> : <p className="text-lg text-gray-600 dark:text-gray-400">
                            Your order status is {order.order_status}.
                        </p>}
                        
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Your payment method is {order.pay_method}.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Your order total is {order.order_total} THB.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your delivery address is {order.deli_address}.
                        </p>
                        
                    </CardContent>
                </Card>
            )) : <></>}
            <Card>

            </Card>
            </>) : <></>}
            
    </div> );
}
 
export default Tracker;