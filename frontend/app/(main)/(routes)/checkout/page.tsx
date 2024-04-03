"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { ModeToggle, ModeToggleTG } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";
import { Menu, X, ChevronDown, ShoppingCart, Trash } from "lucide-react";
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
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
  import { toast } from "@/components/ui/use-toast"

import { getCart, createShoppingCart, getShoppingCart, deleteCartItem } from "@/api/cart";
import { createOrder } from "@/api/order";

import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const FormSchema = z.object({
    type: z.enum(["CASH", "ONLINEPAYMENT"], {
      required_error: "You need to select a payment method.",
    }),
  })

const Checkout = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [cart, setCart] = useState([]);
    const [ShoppingCart, setShoppingCart] = useState(null);
    const [shippingPrice, setShippingPrice] = useState(40);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })

      function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
        if(data.type === 'CASH') {
            handleOrder();
        } else {
           makePayment();
        }
      }

      const handleOrder = async () => {
        const body = {
            pay_method: 'CASH',
            deli_charge: shippingPrice,
            deli_address: mergedAddress(),
        }


        const data = await createOrder(body);
        console.log('Order data:', data);
        if(typeof data === 'string' && data.includes("Request failed")) {
            toast({
                title: "Order failed",
                description: "Your order has failed.",
            })
        }
        else {
        toast({
            title: "Order placed successfully",
            description: "Your order has been placed successfully.",
        })
        router.push(`/checkout/payment/success?orderid=${data.order_id}`);
        }
      }

      const makePayment = async () => {
        console.log('Payment made');
        const stripe = await loadStripe("pk_test_51OievMLRvvHordzTxBgFBNvqlLyx8Wylru1ghOmsfMUBn71u1ADBg0MZyPW3W2ns5kcY07v0UHlfLuA5m76pGGpj001k7i85fY");

        const body = {
            cart,
            deli_charge: shippingPrice,
            deli_address: mergedAddress(),
        }

        const headers = {
            'Content-Type': 'application/json'
        }

        // Send POST request using Axios
        const response = await axios.post(`${apiUrl}/create-payment`, body, {
            headers: headers
        });
        console.log('Response:', response);

        const result = await stripe.redirectToCheckout({
            sessionId: response.data.id
        });

        if (result.error) {
            console.log('Error:', result.error.message);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
              const data = await fetchMe();
              console.log('User data:', data);
              if(typeof data === 'string' && data.includes("Request failed")) {
                // router.push('/login');
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
              setCart(data);
              console.log('Cart data:', data);
              setCartData(data);
          } catch (error) {
              console.error('Error fetching cart data:', error);
              const data = await createShoppingCart();
              console.log('Cart data:', data);
              setCartData(data);
          }
      }
        const fetchShoppingCart = async () => {
            try {
                const data = await getShoppingCart();
                console.log('ShoppingCart data:', data);
                setShoppingCart(data);
            } catch (error) {
                console.error('Error fetching ShoppingCart data:', error);
            }
        }
        
      fetchShoppingCart();  
      fetchCartData(); 
      fetchData(); 
    }, []);

    const mergedAddress = () => {
        if(userData && userData.addressbooks[0]) {
            return userData.addressbooks[0].addb_buildingNo + ' ' + userData.addressbooks[0].addb_buildingName + ' ' + userData.addressbooks[0].addb_street + ' ' + userData.addressbooks[0].addb_prov + ' ' + userData.addressbooks[0].addb_dist + ' ' + userData.addressbooks[0].addb_subdist + ' ' + userData.addressbooks[0].addb_zipcode + ' ' + '( ' + userData.addressbooks[0].addb_directionguide + ' Phone:' + userData.addressbooks[0].addb_phone + ' )' ;
        }
        return '';
    }

    return (
        <div className="h-full flex flex-col  items-center space-y-4 p-8 md:flex">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold  first:mt-0">
                Checkout
            </h2>
            <Card className="w-full md:w-[705px] xl:w-[1214px]">
                <CardHeader>
                    <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{mergedAddress()}</p>
                </CardContent>
            </Card>
            <Card className="w-full md:w-[705px] xl:w-[1214px]">
                <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        {Array.isArray(cartData) ? cartData.map((item) => (
                            <div key={item.cartit_id} className="flex justify-between">
                                <p>{item.quantity} x {item.food.fd_name}</p>
                                <p>{item.quantity * item.food.fd_price} THB</p>
                            </div>
                        )) : <Spinner />}
                    </div>
                    <div className="flex justify-between font-medium">
                        <p>Shipping cost</p>
                        <p> {shippingPrice} THB</p>
                    </div>
                    <div className="flex justify-between font-medium">
                        <p>Order Total</p>
                        <p>{ShoppingCart ? ShoppingCart.cart_total : <Spinner />} THB</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-between font-medium">
                        <p>Order Total</p>
                        <p>{": "} {ShoppingCart ? ShoppingCart.cart_total+shippingPrice : <Spinner />} THB</p>
                    </div>
                </CardFooter>
            </Card>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full md:w-[705px] xl:w-[1214px] mb-4">
                <CardHeader>
                    <CardTitle>Payment option</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CASH" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Cash on Delivery
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ONLINEPAYMENT" />
                    </FormControl>
                    <FormLabel className="font-normal">
                    Online Payment
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                </CardContent>
            </Card>
            <Button className="bg-green-600 dark:bg-green-300 hover:bg-secondary-foreground" type="submit">Place Order</Button>
            </form>
            </Form>
        </div> 
              );
}
 
export default Checkout;