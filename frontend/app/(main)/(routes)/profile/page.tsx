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
import { login, fetchMe, logout } from '@/api/auth';
import { useToast } from "@/components/ui/use-toast";
import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
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
import { updateUser } from "@/api/users";

const formSchema = z.object({
  us_fname: z.string().min(1, "First name is required").max(50, "First name must not exceed 50 characters"),
  
  us_lname: z.string().min(1, "Last name is required").max(50, "Last name must not exceed 50 characters"),
  
  us_gender: z.string({
    required_error: "Please select a gender.",
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

const Profile = () => {

    const [Id, setId] = useState("");

    const [userDetails, setUserDetails] = React.useState({
        us_fname: "",
        us_lname: "",
        us_gender: "",
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
        // if (values.us_password === '') {
        //     values.us_password = userDetails.us_password;
        //     values.confirm_password = userDetails.us_password;
        // }
        setUserDetails(values);
        console.log("Updating user:", userDetails);
        handleUpdateUser(values);
    };

    const handleUpdateUser = (values:any) => {
        // updateUser(Id, values)
        console.log("Updating user:", values);
        try {
            console.log('User ID:', Id, 'User details:', userDetails);
            const update = updateUser(Id, values);
            console.log('User updated:', update.then((result) => {
              console.log("Promise fulfilled:", result);
              window.location.reload();
            }).catch((error) => {
              console.error("Promise rejected:", error);
            }));
           
        } catch (error) {
            console.error('Error updating user:', error);
        }   
    };

    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const data = await fetchMe();
            setId(data.user_id);
            form.reset(data);
            form.setValue('us_birthdate', new Date(data.us_birthdate));
            form.setValue('us_password', data.us_password);
            form.setValue('confirm_password', data.us_password);
            // form.setValue('us_gender', data.us_gender);
            setUserDetails(data);
            // console.log(data);
          } catch (error) {
            console.error('Error fetching user data:', error);
            router.push('/');
          }
        } 
        fetchUserData();
      }, [Id, setUserDetails]);

    return ( <div>
        <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <div className="flex items-center justify-between">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
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
                            <Select onValueChange={field.onChange} defaultValue={userDetails.us_gender}>
                            <FormControl>
                                <SelectTrigger id="us_gender">
                                    <SelectValue placeholder={userDetails.us_gender} />
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                            <FormControl>
                                <SelectTrigger id="us_role">
                                    <SelectValue placeholder={field.value} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    
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
                            <FormLabel>New Password</FormLabel>
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
                    <Button type="submit">Update Profile</Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
                {/* <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={onSubmit}>Update User</Button>
                </CardFooter> */}
            </Card>
        </div>
      </div>
    </ScrollArea>
    </div> );
}
 
export default Profile;