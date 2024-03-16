"use client";

import BreadCrumb from "@/components/breadcrumb";
import { UserClient } from "@/components/tables/user-tables/client";
import { users } from "@/constants/data";
import axios from "axios";
import { use, useEffect, useState } from "react";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];

const ManageUser = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

    return ( 
    <>
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <UserClient data={data} />
        </div>
    </> 
    );
}
 
export default ManageUser;