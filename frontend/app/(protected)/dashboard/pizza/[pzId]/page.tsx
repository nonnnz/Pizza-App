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
import { getPizza, updatePizza } from "@/api/food";
import axios from 'axios';

const formSchema = z.object({
    pz_name: z.string().min(1, "Pizza name is required").max(50, "Pizza name must not exceed 50 characters"),
    pz_des: z.string().max(100, "Pizza description must not exceed 100 characters"),
    pz_image: z.string(),
    });

export default function Page() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const pathname = usePathname()
    const pzId = pathname.split('/').pop();
    let Id = '';
    if(pzId) Id = pzId;

    const breadcrumbItems = [
        { title: "Pizza", link: "/dashboard/pizza" },
        { title: "Update", link: "/dashboard/pizza/new" }
        ];

    const [dataDetails, setDataDetails] = useState({
        pz_name: "",
        pz_des: "",
        pz_image: "",
    });


    const form = useForm
    ({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pz_name: "",
            pz_des: "",
            pz_image: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Update data details with form values
        setDataDetails(values);
        console.log("Updating:", dataDetails);
        console.log("Updating file:", file);
    
        // If a file is selected, upload it first
        if (file) {
            handdleFileUpload(file)
                .then((result) => {
                    console.log('File uploaded:', result);
                    const fileName = result.file.originalname;
                    const imagePath = `pizza/${fileName}`;
                    // Update data details with the image path
                    setDataDetails({ ...dataDetails, pz_image: imagePath });
                    // Update the pz_image value in the values object
                    const updatedValues = { ...values, pz_image: imagePath };
                    // Call handleUpdatePizza after uploading the file
                    handleUpdatePizza(updatedValues);
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    // If there's an error uploading the file, handleUpdatePizza won't be called
                });
        } else {
            // If no file is selected, directly call handleUpdatePizza
            handleUpdatePizza(values);
        }
    }

    const handdleFileUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post(`${apiUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            return error.message;
        }
    };

    const handleUpdatePizza = (values:any) => {
        // updateUser(Id, values)
        console.log("Updating pizza:", values);
        try {
            const update = updatePizza(Id, values);
            console.log('Pizza updated:', update.then((result) => {
              console.log("Promise fulfilled:", result);
              router.push('/dashboard/pizza');
            }).catch((error) => {
              console.error("Promise rejected:", error);
            }));
           
        } catch (error) {
            console.error('Error updating pizza:', error);
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
            const data = await getPizza(Id);
            form.reset(data)
            console.log('Pizza data:', data);
            setDataDetails(data);
        } catch (error) {
            console.error('Error fetching pizza data:', error);
        }
    }
      fetchData(); // Call the async function
      fetchPizzaData();
    }, [Id, setDataDetails]);

    const [file, setFile] = useState(null);

    const handleFileChange = (e:any) => {
        setFile(e.target.files[0]);
    };

  
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Update Pizza</CardTitle>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <FormField
                            control={form.control}
                            name="pz_name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Pizza Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Pizza name" {...field} />
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
                        name="pz_des"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Pizza Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Pizza description" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                        <FormField
                        control={form.control}
                        name="pz_image"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Pizza Image</FormLabel>
                            <FormControl>
                                <Input id="pz_image" type="file" onChange={handleFileChange} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <img src={`${apiUrl}/public/${dataDetails.pz_image}`} alt="Pizza preview" className="w-20 h-20" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                    <Button type="submit">Update Pizza</Button>
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