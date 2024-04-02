"use client";

import BreadCrumb from "@/components/breadcrumb";
// import { MenuClient } from "@/components/tables/food-tables/client";
import { OrderClient } from "@/components/tables/order-tables/client";

// import { UserClient } from "@/components/tables/user-tables/client";
// import { users } from "@/constants/data";
import { fetchOrders } from "@/api/order";
import { use, useEffect, useState } from "react";

const breadcrumbItems = [{ title: "Order", link: "/dashboard/order" }];

const Order = () => {
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrdersData();
  }, []);


    const fetchOrdersData = async () => {
        try {
            const data = await fetchOrders();
            console.log('order data:', data);
            setData(data);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    }

    return ( 
    <>
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <OrderClient data={data} />
        </div>
    </> 
    );
}
 
export default Order;