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

const MenuPage = () => {
    const [pizza, setPizza] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPizza();
                console.log('Pizza data:', data);
                setPizza(data);
            } catch (error) {
                console.error('Error fetching pizza data:', error);
            }
        };
        fetchData(); 
    }, [pizza]);

    return ( 
        <div>
            <h1>Menu Page</h1>

        </div>
     );
}
 
export default MenuPage;