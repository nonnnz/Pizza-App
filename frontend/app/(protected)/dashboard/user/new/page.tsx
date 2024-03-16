"use client";

import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { format, set } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { create } from "domain";
import { createUser } from "@/api/users";


const formSchema = z.object({
    us_fname: z.string().min(1, "First name is required").max(50, "First name must not exceed 50 characters"),
    
    us_lname: z.string().min(1, "Last name is required").max(50, "Last name must not exceed 50 characters"),
    
    us_gender: z.string({
      required_error: "Please select a gender.",
    }),
  
    us_role: z.string({
      required_error: "Please select a role.",
    }),
  
    us_phone: z.string().refine(value => /^[0-9]{10}$/.test(value), {
      message: "Invalid phone number. Please enter a 10-digit number.",
    }),
  
    us_birthdate: z.date({
        required_error: "A date of birth is required.",
      }),
  
    us_email: z.string().min(1, "Email is required").email({
      message: "Invalid email address. Please enter a valid email.",
    }),
  
    us_password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters."),
    
    confirm_password: z.string().min(1, "Confirm password is required")
  })
  .refine(data => data.us_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match. Please try again.",
  });
  

export default function Page() {
    const breadcrumbItems = [
    { title: "User", link: "/dashboard/user" },
    { title: "Create", link: "/dashboard/user/new" }
    ];

    const [userDetails, setUserDetails] = React.useState({
    us_fname: "",
    us_lname: "",
    us_gender: "",
    us_role: "",
    us_phone: "",
    us_birthdate: "",
    us_email: "",
    us_password: "",
    confirm_password: "",
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          us_fname: "",
          us_lname: "",
          us_gender: undefined,
          us_role: undefined,
          us_phone: "",
          us_birthdate: undefined,
          us_email: "",
          us_password: "",
          confirm_password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        if (values.us_birthdate instanceof Date) {
            // Cast the type to 'any' before assigning the ISO string
            (values.us_birthdate as any) = values.us_birthdate.toISOString();
          }
        // console.log("Creating user:", values);
        setUserDetails(values);
        console.log("Creating user:", userDetails);
        handleCreateUser(values);
    };

    const handleCreateUser = (values: any) => {
        console.log("Creating user:", values);
        try {
            const create = createUser(values);
            console.log('User created:', create.then((result) => {
                console.log("Promise fulfilled:", result);
                router.push('/dashboard/user');
              }).catch((error) => {
                console.error("Promise rejected:", error);
              }));
              
        } catch (error) {
            console.error('Error creating user: front', error);
        }
    };

    const handleChange = (field, value) => {
    setUserDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
    };

    const handleCreateUser_old = () => {
    // Implement your logic to create a user with userDetails
    console.log("Creating user:", userDetails);
    };

    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchMe();
                setUserData(data);
                if (data.us_role !== 'ADMIN' && data.us_role !== 'MANAGER') {
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            }
            };
        
            fetchData(); // Call the async function
    }, []);
  
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create User</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="us_fname"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter first name" {...field} />
                                </FormControl>
                                {/* <FormDescription>This is your first name.</FormDescription> */}
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="us_lname"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="us_gender"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger id="us_gender">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
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
                        name="us_role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger id="us_role">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="KITCHEN">Kitchen</SelectItem>
                                    <SelectItem value="DELIVERY">Delivery</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    {userData?.us_role === 'ADMIN' && (
                                        <>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        </>
                                    )}
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
                        name="us_phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                id="us_phone"
                                type="tel"
                                placeholder="Enter phone number"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="us_birthdate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="us_email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                id="us_email"
                                type="email"
                                placeholder="Enter email"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="us_password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                id="us_password"
                                type="password"
                                placeholder="Enter password"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                id="confirm_password"
                                type="password"
                                placeholder="Confirm password"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                    </div>
                    <div className="flex justify-end">
                    <Button type="submit">Create User</Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
                {/* <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={onSubmit}>Create User</Button>
                </CardFooter> */}
            </Card>
        </div>
      </div>
    </ScrollArea>
  );
}