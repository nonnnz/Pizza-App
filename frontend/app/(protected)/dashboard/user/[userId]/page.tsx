import BreadCrumb from "@/components/breadcrumb";
// import { ProductForm } from "@/components/forms/product-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "User", link: "/dashboard/user" },
    { title: "Update", link: "/dashboard/user/Update" }
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Update User Form...</h1>
        </div>
      </div>
    </ScrollArea>
  );
}