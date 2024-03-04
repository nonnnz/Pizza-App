"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { login, fetchMe, logout } from '@/api/auth';
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
    const handleFetchMe = async () => {
        console.log('Fetching me');
        try {
          const userData = await fetchMe();
          console.log('User data:', userData);
        } catch (error) {
          console.error('FetchMe error', error);
        }
      };

    return (
        <div className="h-full flex flex-col  items-center space-y-4 p-8 md:flex">
        <div className="flex items-center gap-4 w-full md:w-[705px] xl:w-[1214px] justify-end">
            <p>Don't have an account?{" "}</p>
            <Link href="/register">
                <Button variant="default">
                    {/* <UserPlus size={20} className="mr-2" /> */}
                    Register
                </Button>
            </Link>
        </div>
      <Card className="w-full md:w-[705px] xl:w-[1214px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
        <form className="flex flex-col space-y-1.5">

          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleFetchMe}>Fetch Me</Button>
        </CardFooter>
      </Card>
    </div>
     );
}
 
export default Register;