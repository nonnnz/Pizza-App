"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { fetchMe } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"


// Data base functions
import { getOrder, updateOrder } from "@/api/order";
import { getUser } from "@/api/users";

const formSchema = z.object({
    order_status: z.string(),
    });

export default function Page() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const pathname = usePathname()
    const pzId = pathname.split('/').pop();
    let Id = '';
    if(pzId) Id = pzId;
    const { toast } = useToast();

    const breadcrumbItems = [
        { title: "Order", link: "/dashboard/order" },
        { title: "Update", link: "/dashboard/order/new" }
        ];

    const [dataDetails, setDataDetails] = useState({
        order_status: "",
    });

    const [orderDetails, setOrderDetails] = useState({
        order_id: 0,
        order_status: "",
        deli_charge: 0,
        order_total: 0,
        deli_address: "",
        pay_method: "",
        created_at: "",
        updated_at: "",
        user_id: "",
        sessionId: ""
    });


    const form = useForm
    ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            order_status: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Update data details with form values
        setDataDetails(values);
        console.log("Updating:", dataDetails);
        handleUpdateOrder(values);
    }

    const handleUpdateOrder = (values:any) => {
        console.log("Updating order:", values);
        try {
            const updateFromData = {
                order_status: values.order_status,
            };
            console.log("Updating order:", updateFromData);
            const update = updateOrder(Id, updateFromData);
            console.log('Order updated:', update.then((result) => {
            console.log("Promise fulfilled:", result);

            if (typeof result === 'string' && result.includes("Request failed")) {
            toast({
                variant: "destructive",
                title: "Error updating order",
                description: "Error updating order."
            });
            } else {
            toast({
                variant: "default",
                title: "Order updated",
                description: "Order updated successfully."
            });
            router.push('/dashboard/order');
            }

            }).catch((error) => {
              console.error("Promise rejected:", error);
            }));
           
        } catch (error) {
            console.error('Error updating order:', error);
        }   
    }


    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMe();
                setUserData(data);
                // console.log(data.us_role);
                if (data.us_role !== 'ADMIN' && data.us_role !== 'MANAGER' && data.us_role !== 'KITCHEN' && data.us_role !== 'DELIVERY') {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        const fetchOrderData = async () => {
            try {
                const data = await getOrder(Id);

                form.reset(data);
                setDataDetails(data);
                setOrderDetails(data);
                console.log('Order data:', data.user_id);

                // customer
                const userData = await getUser(data.user_id);
                setCustomerData(userData);
                console.log('Customer data:', userData);
            } catch (error) {
                console.error('Error fetching food data:', error);
            }
        }

        const fetchCustomerData = async () => {
            try {
                console.log('Fetching user data:', orderDetails.user_id);
                const data = await getUser(orderDetails.user_id);
                setCustomerData(data);
                console.log('Customer data:', data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData(); // Call the async function
        fetchOrderData();
        // fetchCustomerData();
        
    }, [Id, setDataDetails]);

    const [customerData, setCustomerData] = useState({
        us_fullname: "",
        us_phone: "",
    });

  
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Update Order</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="order_status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Order status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={`${dataDetails.order_status}`}>
                            <FormControl>
                                <SelectTrigger id="size_name">
                                    <SelectValue placeholder={`${dataDetails.order_status}`} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* <SelectItem value="PENDING">Pending</SelectItem> */}
                                    {/* <SelectItem value="RECEIVED">Received</SelectItem> */}
                                    <SelectItem value="INPROGRESS">In Progress</SelectItem>
                                    <SelectItem value="OUTFORDELIVERY">Out for Delivery</SelectItem>
                                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    </div>
                    <div className="flex justify-end">
                    <Button type="submit">Update Order</Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
        <div>
        <Card className="w-full">
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label>Order ID</Label>
                            <Input value={orderDetails.order_id} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Order Status</Label>
                            <Input value={orderDetails.order_status} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Delivery Charge</Label>
                            <Input value={orderDetails.deli_charge} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Order Total</Label>
                            <Input value={orderDetails.order_total} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Customer Name</Label>
                            <Input value={customerData ? customerData.us_fullname : ''} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Customer Phone</Label>
                            <Input value={customerData ? customerData.us_phone : ''} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Delivery Address</Label>
                            <Input value={orderDetails.deli_address} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Payment Method</Label>
                            <Input value={orderDetails.pay_method} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Created At</Label>
                            <Input value={orderDetails.created_at} disabled />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label>Updated At</Label>
                            <Input value={orderDetails.updated_at} disabled />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </ScrollArea>
  );
}