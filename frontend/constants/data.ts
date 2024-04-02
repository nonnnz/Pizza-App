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

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

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