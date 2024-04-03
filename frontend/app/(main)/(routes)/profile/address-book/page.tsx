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
import { createUser, getAddressBook, updateAddressBook, createAddressBook } from "@/api/users";
import { M_PLUS_1 } from "next/font/google";

const formSchema = z.object({
    addb_buildingNo: z.string().min(1, "Building number is required").max(50, "Building number must not exceed 50 characters"),
    addb_buildingName: z.string().max(50, "Building name must not exceed 50 characters"),
    addb_street: z.string().min(1, "Street is required").max(50, "Street must not exceed 50 characters"),
    addb_prov: z.string().min(1, "Province is required").max(50, "Province must not exceed 50 characters"),
    addb_dist: z.string().min(1, "District is required").max(50, "District must not exceed 50 characters"),
    addb_subdist: z.string().min(1, "Subdistrict is required").max(50, "Subdistrict must not exceed 50 characters"),
    addb_zipcode: z.string().min(1, "Zipcode is required").max(50, "Zipcode must not exceed 50 characters"),
    addb_directionguide: z.string(),
    addb_phone: z.string().min(1, "Phone number is required").max(50, "Phone number must not exceed 50 characters"),
  });

const AddressBook = () => {
    const [dataDetails, setdataDetails] = React.useState({
        addb_user_id: "",
        addb_buildingNo: "",
        addb_buildingName: "",
        addb_street: "",
        addb_prov: "",
        addb_dist: "",
        addb_subdist: "",
        addb_zipcode: "",
        addb_directionguide: "",
        addb_phone: "",
        addb_name: "",
    });
    const [isExisting, setIsExisting] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: dataDetails,
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const updatedDetails = {
            ...dataDetails, // Spread the existing dataDetails
            ...values, // Spread the new values
            addb_user_id: userData.user_id, // Add additional properties
            addb_name: "Home"
        };
    
        // Set the merged object as the new dataDetails
        setdataDetails(updatedDetails);
    
        // Log the merged object
        console.log("Merging:", dataDetails);
        if(isExisting){
            handleUpdateAddressBook(updatedDetails);
        }
        else{
            handleCreateAddressBook(updatedDetails);
        }
    
    };

    const handleCreateAddressBook = (values:any) => {
        console.log("Creating address book:", values);
        try {
            const create = createAddressBook(values);
            console.log('Address book created:', create.then((result) => {
              console.log("Promise fulfilled:", result);
              window.location.reload();
            }).catch((error) => {
              console.error("Promise rejected:", error);
            }));
           
        } catch (error) {
            console.error('Error creating address book:', error);
        }   
    }

    const handleUpdateAddressBook = (values:any) => {
        console.log("Updating address book:", values);
        try {
            const update = updateAddressBook(dataDetails.addb_user_id, values);
            console.log('Address book updated:', update.then((result) => {
              console.log("Promise fulfilled:", result);
              window.location.reload();
            }).catch((error) => {
              console.error("Promise rejected:", error);
            }));
           
        } catch (error) {
            console.error('Error updating address book:', error);
        }   
    }

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const data = await fetchMe();
            form.reset(data);
            form.setValue('us_birthdate', new Date(data.us_birthdate));
            form.setValue('us_password', data.us_password);
            form.setValue('confirm_password', data.us_password);
            // form.setValue('us_gender', data.us_gender);
            setUserData(data);
            setdataDetails(data.addressbooks[0]);
            console.log(data.addressbooks[0]);
            if (data.addressbooks.length > 0) {
              setIsExisting(true);
              form.reset(data.addressbooks[0]);
            }
            // console.log(data);
          } catch (error) {
            console.error('Error fetching user data:', error);
            router.push('/');
          }
        } 
        fetchUserData();
      }, [setdataDetails]);

    const [userData, setUserData] = useState({
        user_id: ""
    });
    const router = useRouter();
    // console.log('User data:', userData);

    return ( <div>
        <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <div className="flex items-center justify-between">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Address Book</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_buildingNo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Building No.</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Building" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_buildingName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Building Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Building Name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_street"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Street</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Street" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_prov"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Province" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_dist"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter District" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_subdist"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Subdistrict</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Subdistrict" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_zipcode"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Zipcode</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Zipcode" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_directionguide"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Direction Guide</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Direction Guide" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="addb_phone"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Phone" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                    <Button type="submit">Update Address Book</Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
      </div>
    </ScrollArea>
    </div> );
}
 
export default AddressBook;