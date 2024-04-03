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
import { getCart, createShoppingCart, getShoppingCart, deleteCartItem } from "@/api/cart";

const Cart = () => {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [ShoppingCart, setShoppingCart] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
              const data = await fetchMe();
              console.log('User data:', data);
              setUserData(data);
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

    const del = async (id) => {
        console.log(id);
        const data = id.toString();
        await deleteCartItem(data);
        window.location.reload();
      }
    
    return ( 
        <div className="h-full flex flex-col  items-center space-y-4 p-8 md:flex">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold  first:mt-0">
                My Basket
              </h2>
              {cartData !== null ? cartData.map((item) => (
                <>
                {cartData.length > 0 ? <>
                    <Card className="w-full md:w-[705px] xl:w-[1214px] pt-10">
                        <CardContent>
                            <div className="flex flex-col space-y-1.5">
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold">{item.food.fd_name}</h3>
                                        <p className="text-sm text-gray-500">{item.food.fd_description}</p>
                                        <p className="text-sm text-gray-500">Price: {item.food.fd_price}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold">x{item.quantity}</h3>
                                        <p className="text-sm text-gray-500">Quantity</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold">{item.cartit_total}</h3>
                                        <p className="text-sm text-gray-500">Total Price</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-5"><Button onClick={() => del(item.cart_itemid)} >
                            <Trash className="mr-2 h-4 w-4" /> Remove
                            </Button></div>
                        </CardContent>
                    </Card>
                </> : <></>}
                </>
              )) : <>
              <h1>
                    Your cart is empty
              </h1>
              </>}
              <div className="w-full md:w-[705px] xl:w-[1214px] flex justify-between">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Total Price: {ShoppingCart !== null ? ShoppingCart.cart_total : 0}
              </h3>
              <Link href="/checkout">
                <Button className="bg-green-600 dark:bg-green-300 hover:bg-secondary-foreground" >Proceed to Checkout</Button>
            </Link>
              </div>
              

        </div>
     );
}
 
export default Cart;