"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { fetchPizza } from "@/api/food";
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
import { getCart, createShoppingCart, addToCart, updateCartItem } from "@/api/cart";
import { useReactTable } from "@tanstack/react-table";
import { set } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fd_id: z.string({
    required_error: "Please select a food.",
  }),
});


const MenuPage = () => {
    const [pizza, setPizza] = useState();
    const [cart, setCart] = useState();
    const [CartSuccess, setCartSuccess] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const [order, setOrder] = useState({
      cartit_food_id: 0,
      quantity: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPizza();
                // console.log('Pizza data:', data);
                setPizza(data);
            } catch (error) {
                console.error('Error fetching pizza data:', error);
            }
        };
        fetchData(); 
    }, []);

    useEffect(() => {
      const fetchCart = async () => {
        try {
            const data = await getCart();
            console.log('Cart data:', data);
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    }
    fetchCart();
  }, [CartSuccess]);

    useEffect(() => {
    console.log('Order:', order);
    if (order.quantity > 0) {
      handleAddToCart();
    }
    }
    , [order]);

    console.log(pizza);



    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        fd_id: "",
      },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log('Form values:', values);
      if(values.fd_id !== "") {
      const quantity = findQuantity(parseInt(values.fd_id))+1;
      setOrder({
        ...order,
        cartit_food_id: parseInt(values.fd_id),
        quantity: quantity,
      });
      // console.log('Order:', order);
      // handleAddToCart();
    }
    };
    const { toast } = useToast();
    const handleAddToCart = async () => {
      try {
        const data = await addToCart(order);
        console.log('Added to cart:', data);
        if(data.message === "Request failed with status code 409"){
          console.log('Error adding to cart:', data.response.data.message);
          const updateCart = await updateCartItem(data.response.data.cartId, order);
          console.log('Updated cart:', updateCart);
          setCartSuccess(!CartSuccess);
          // window.location.reload();
          toast({
            variant: "default",
            title: `${findOrderName(order.cartit_food_id)} Added to cart`,
            description: `You have added ${order.quantity} item(s) to your cart.`,
        });
        } else {
          // window.location.reload();
          setCartSuccess(!CartSuccess);
          toast({
            variant: "default",
            title: `${findOrderName(order.cartit_food_id)} Added to cart`,
            description: `You have added ${order.quantity} item(s) to your cart.`,
        });
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        // console.log('Response data:', error);
      }
    }
    function findOrderName(fd_id) {
      let name = "";
      if (pizza && pizza.length > 0) {
        pizza.forEach((item) => {
          if (item.pizzadetails.length > 0) {
            item.pizzadetails.forEach((items) => {
              if (items.fd_id === fd_id) {
                name = items.food.fd_name;
              }
            });
          }
        });
      }
      return name;
    }

    function findQuantity(fd_id) {
      let quantity = 0;
      if (cart && cart.length > 0) {
        cart.forEach((item) => {
          if (item.cartit_food_id === fd_id) {
            quantity += item.quantity;
          }
        });
      }
      return quantity;
    }
    

    return ( 
        <div className="h-full flex flex-col  items-center space-y-4 p-8 md:flex">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold  first:mt-0">
                Pizza BKK
              </h2>
            {pizza ? pizza.map((item) => (
              <>
              {item.pizzadetails.length > 0 ? <div >
              
              <Card className="w-full md:w-[705px] xl:w-[1214px] pt-10">
                  <CardContent>
                  <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <FormField
                        control={form.control}
                        name="fd_id"
                        render={({ field }) => (
                          <FormItem>
                    <div className="grid grid-cols-2">
                      <div className="place-self-center ">
                      <img src={`${apiUrl}/public/${item.pz_image}`} alt="Pizza preview" className="w-36" />
                      </div>
                      <div>
                        <h1>{item.pz_name}</h1>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {item.pizzadetails.length > 0 ? item.pizzadetails.map((items) => (
                                <SelectItem key={(items.fd_id).toString()} value={(items.fd_id).toString()}> {items.food.fd_name} - {items.food.fd_price} THB</SelectItem>
                              )) : <></>}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                    </FormItem>
                    )}/>
                    <div className="flex justify-end">
                    <Button type="submit" className="bg-green-600 dark:bg-green-300 hover:bg-secondary-foreground" >Add to cart</Button>
                    </div>
                  </form>
                  </Form>
                  </CardContent>
                  <CardFooter>
                  </CardFooter>
              </Card>
              </div>: <></>}
            </>
            ) ) : <></>}

        </div>
     );
}
 
export default MenuPage;