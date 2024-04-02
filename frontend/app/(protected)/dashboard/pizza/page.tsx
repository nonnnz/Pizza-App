"use client";

import BreadCrumb from "@/components/breadcrumb";
import { PizzaClient } from "@/components/tables/pizza-tables/client";
// import { UserClient } from "@/components/tables/user-tables/client";
// import { users } from "@/constants/data";
import { fetchPizza } from "@/api/food";

import axios from "axios";
import { use, useEffect, useState } from "react";

const breadcrumbItems = [{ title: "Pizza", link: "/dashboard/pizza" }];

const Pizza = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPizzaData();
  }, []);


    const fetchPizzaData = async () => {
        try {
            const data = await fetchPizza();
            console.log('Pizza data:', data);
            setData(data);
        } catch (error) {
            console.error('Error fetching pizza data:', error);
        }
    }

    return ( 
    <>
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <PizzaClient data={data} />
        </div>
    </> 
    );
}
 
export default Pizza;