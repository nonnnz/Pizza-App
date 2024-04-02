"use client";

import BreadCrumb from "@/components/breadcrumb";
import { MenuClient } from "@/components/tables/food-tables/client";

// import { UserClient } from "@/components/tables/user-tables/client";
// import { users } from "@/constants/data";
import { fetchPizza, fetchFood } from "@/api/food";
import { use, useEffect, useState } from "react";

const breadcrumbItems = [{ title: "Menu", link: "/dashboard/menu" }];

const Menu = () => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoodData();
  }, []);


    const fetchFoodData = async () => {
        try {
            const data = await fetchFood();
            console.log('Menu data:', data);
            setData(data);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
    }

    return ( 
    <>
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <MenuClient data={data} />
        </div>
    </> 
    );
}
 
export default Menu;