"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { navItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { fetchMe } from "@/api/auth";
import { useEffect, useState } from "react";
import { NavItem, SidebarNavItem } from "@/types";

export default function Sidebar() {
    const [newNavItems, setNewNavItems] = useState<NavItem[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await fetchMe(); // Assuming this function returns the user object with a 'role' property
                console.log('User:', user);
                if (user.us_role === 'KITCHEN' || user.us_role === 'DELIVERY') {
                    setNewNavItems(navItems.filter(item => item.title === "Order" || item.title === "Dashboard"));
                } else {
                    setNewNavItems(navItems);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [setNewNavItems]);


  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2>
            <DashboardNav items={newNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}