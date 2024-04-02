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
import { fetchPizza,getPizza, updatePizza, getFood, updateFood, createFood } from "@/api/food";

const formSchema = z.object({
    size_name: z.string().min(1, "Size name is required").max(50, "Size name must not exceed 50 characters"),
    crust_name: z.string().min(1, "Crust name is required").max(50, "Crust name must not exceed 50 characters"),
    pz_id: z.string().min(1, "Pizza is required"),
    fd_price: z.string(),
    });

export default function Page() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const pathname = usePathname()
    const pzId = pathname.split('/').pop();
    let Id = '';
    if(pzId) Id = pzId;
    const { toast } = useToast();

    const breadcrumbItems = [
        { title: "Menu", link: "/dashboard/menu" },
        { title: "Create", link: "/dashboard/menu/new" }
        ];

    const [dataDetails, setDataDetails] = useState({
        size_name: "",
        crust_name: "",
        pz_id: "",
        fd_price: 0,
    });


    const form = useForm
    ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            size_name: "",
            crust_name: "",
            pz_id: "",
            fd_price: 0,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Update data details with form values
        setDataDetails(values);
        console.log("Updating:", dataDetails);
        // handleUpdateFood(values);
        handleCreateFood(values);
    }

    const handleCreateFood = (values:any) => {
        console.log("Creating food:", values);
        try {
            const createFromData = {
                size_name: values.size_name,
                crust_name: values.crust_name,
                pz_id: parseInt(values.pz_id),
                fd_price: parseInt(values.fd_price)
            };
            console.log("Creating food:", createFromData);
            const create = createFood(createFromData);
            console.log('Food created:', create.then((result) => {
              console.log("Promise fulfilled:", result);
              
              if (typeof result === 'string' && result.includes("Request failed")) {
                toast({
                  variant: "destructive",
                  title: "Error creating food",
                  description: "There was an error creating the food. Please try again later.",
                });
              } else {
                toast({
                  variant: "default",
                  title: "Food created",
                  description: "Food has been created successfully.",
                });
                router.push('/dashboard/menu');
              }
            }).catch((error) => {
              console.error("Promise rejected:", error);
            }));
           
        } catch (error) {
            console.error('Error creating food:', error);
        }   
    }


    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [pizzaData, setPizzaData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMe();
                setUserData(data);
                // console.log(data.us_role);
                if (data.us_role !== 'ADMIN' && data.us_role !== 'MANAGER') {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
        };

        const fetchPizzaData = async () => {
            try {
                const data = await fetchPizza();
                // form.reset(data)
                // console.log('Pizza data:', data);
                setPizzaData(data);
            } catch (error) {
                console.error('Error fetching pizza data:', error);
            }
        }

        fetchData(); // Call the async function
        fetchPizzaData();
        
    }, []);

    const findPzName = (Id) => {
        if (pizzaData && Id) {
            const Idint = parseInt(Id);
            const pizza = pizzaData.find(pizza => pizza.pz_id === Idint);
            return pizza ? pizza.pz_name.toString() : "";
        }
        return "";
    };
    

  
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Menu</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="pz_id"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Pizza</FormLabel>
                            <Select onValueChange={field.onChange} >
                            <FormControl>
                                <SelectTrigger id="pz_id">
                                    <SelectValue placeholder="Select Pizza" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {pizzaData &&
                                    pizzaData.map((item) => (
                                    <SelectItem key={item.pz_id} value={item.pz_id.toString()}>
                                        {item.pz_name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="size_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={`${dataDetails.size_name}`}>
                            <FormControl>
                                <SelectTrigger id="size_name">
                                    <SelectValue placeholder="Select Size" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Large">Large</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="crust_name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Crust</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter crust name" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>
                                Pan, Crispy Thin, Extreme Cheese or other
                            </FormDescription>
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="fd_price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Food Price</FormLabel>
                                <FormControl>
                                <Input placeholder="Enter Food Price" {...field} type="number" min={0}/>
                                </FormControl>
                                {/* <FormDescription>This is your first name.</FormDescription> */}
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                    <Button type="submit">Create Menu</Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </ScrollArea>
  );
}