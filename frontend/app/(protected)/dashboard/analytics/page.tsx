"use client";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchOrders } from "@/api/order";
import { useEffect, useState } from "react";


const Analytics = () => {
    const [orders, setOrders] = useState([{
        order_id: 0,
        order_status: "",
        deli_charge: 0,
        order_total: 0,
        deli_address: "",
        pay_method: "",
        created_at: "",
        updated_at: "",
        user_id: "",
        sessionId: ""
    }]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const data = await fetchOrders();
                console.log('Order data:', data);
                setOrders(data);
            } catch (error) {
                console.error('Error fetching food data:', error);
            }
        }
        fetchOrderData();
    }, [setOrders]);

    // Filter orders with status 'DELIVERED'
    const deliveredOrders = orders.filter(order => order.order_status === 'DELIVERED');

    // Calculate total revenue from delivered orders
    const totalRevenue = deliveredOrders.reduce((total, order) => total + order.order_total, 0);

    // Calculate sales count
    const salesCount = deliveredOrders.length;

    return ( 
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Analytics
                    </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} THB</div>
                            {/* Add percentage change if needed */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{salesCount}</div>
                            {/* Add percentage change if needed */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ScrollArea>
    );
}

export default Analytics;