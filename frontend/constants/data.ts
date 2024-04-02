import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type UserTableColumns = {
  user_id: number;
  us_fullname: string;
  us_fname: string;
  us_lname: string;
  us_email: string;
  us_role: string;
}

export type Pizza = {
  pz_id: number;
  pz_name: string;
  pz_des: string;
  pz_image: string;
}

export type Menu = {
  fd_id: number;
  fd_name: string;
  fd_price: number;
  
}

export type Order = {
  order_id: number;
  order_status: string;
  deli_charge: number;
  order_total: number;
  deli_address: string;
  pay_method: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  sessionId: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "User",
    href: "/dashboard/user",
    icon: "user",
    label: "user",
  },
  {
    title: "Pizza",
    href: "/dashboard/pizza",
    icon: "pizza",
    label: "pizza",
  },
  {
    title: "Menu",
    href: "/dashboard/menu",
    icon: "food",
    label: "menu",
  },
  {
    title: "Order",
    href: "/dashboard/order",
    icon: "arrowRight",
    label: "order",
  },
  {
    title: "analytics",
    href: "/dashboard/analytics",
    icon: "analytics",
    label: "analytics",
  }
];