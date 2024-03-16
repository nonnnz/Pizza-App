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
import { createUser } from '@/api/users';

const formSchema = z.object({
    us_fname: z.string().min(2, {
      message: "First Name must be at least 2 characters.",
    }),
    us_lname: z.string().min(2, {
      message: "Last Name must be at least 2 characters.",
    }),
    us_gender: z.string(),
    us_role: z.string(),
    us_phone: z.string(),
    us_birthdate: z.string(),
    us_email: z.string().email(),
    us_password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirm_password: z.string(),
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
          us_gender: "",
          us_role: "",
          us_phone: "",
          us_birthdate: "",
          us_email: "",
          us_password: "",
          confirm_password: "",
        },
    });

    const handleCreateUser = (values) => {
        console.log("Creating user:", values);
        // Implement your logic to create a user with the form values
        
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
                    <form>
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
                            <FormDescription>This is your first name.</FormDescription>
                            </FormItem>
                        )}
                        />
                        <Label htmlFor="us_fname">First Name</Label>
                        <Input
                            id="us_fname"
                            type="text"
                            placeholder="Enter first name"
                            value={userDetails.us_fname}
                            onChange={(e) => handleChange("us_fname", e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_lname">Last Name</Label>
                        <Input
                            id="us_lname"
                            type="text"
                            placeholder="Enter last name"
                            value={userDetails.us_lname}
                            onChange={(e) => handleChange("us_lname", e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_gender">Gender</Label>
                        <Select>
                            <SelectTrigger id="us_gender">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_role">Role</Label>
                        <Select>
                            <SelectTrigger id="us_role">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
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
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_phone">Phone</Label>
                        <Input
                            id="us_phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={userDetails.us_phone}
                            onChange={(e) => handleChange("us_phone", e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_birthdate">Birthdate</Label>
                        <Input
                            id="us_birthdate"
                            type="date"
                            placeholder="Enter birthdate"
                            value={userDetails.us_birthdate}
                            onChange={(e) => handleChange("us_birthdate", e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_email">Email</Label>
                        <Input
                            id="us_email"
                            type="email"
                            placeholder="Enter email"
                            value={userDetails.us_email}
                            onChange={(e) => handleChange("us_email", e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="us_password">Password</Label>
                        <Input
                            id="us_password"
                            type="password"
                            placeholder="Enter password"
                            value={userDetails.us_password}
                            onChange={(e) => handleChange("us_password", e.target.value)}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            type="password"
                            placeholder="Confirm password"
                            value={userDetails.confirm_password}
                            onChange={(e) => handleChange("confirm_password", e.target.value)}
                        />
                        </div>
                    </div>
                    </form>
                </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleCreateUser}>Create User</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </ScrollArea>
  );
}