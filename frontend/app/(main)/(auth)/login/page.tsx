"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const [credentials, setCredentials] = useState({ us_email: '', us_password: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMe();
        console.log('User data:', data);
        if (data.us_role === 'USER') {
          router.push('/');
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle the error, for example, redirect to the login page
        router.push('/login');
      }
    };
  
    fetchData(); // Call the asynchronous function
  
  }, [router]);

  const handleLogin = async () => {
    // console.log('Logging');
    const userData = await login(credentials);
    if (userData.isAxiosError) {
    toast({
        variant: "destructive",
        title: "failed to login",
        description: "Invalid email or password. Please try again.",
    });
    return;
    } else {
        console.log('Login successful', userData);
        toast({
            variant: "default",
            title: "Login successful",
            description: "Welcome back!",
        });
        if (userData.us_role === 'USER') {
          router.push('/'); 
        } else {
          router.push('/dashboard');
        }
    }
  };

  const handleFetchMe = async () => {
    try {
      const userData = await fetchMe();
      console.log('User data:', userData);
    } catch (error) {
      console.error('FetchMe error', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
      // Redirect to login page or perform other actions after logout
    } catch (error) {
      console.error('Logout error', error);
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
            <div className="flex items-center">
            <div className="flex items-center mr-2">
            <Mail size={20} className="mr-2" />
            </div>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                onChange={(e) => setCredentials({ ...credentials, us_email: e.target.value })}
              />
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-2">
                    <Lock size={20} className="mr-2" />
                </div>
              <div className="relative w-full">     
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none bg-background"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    onChange={(e) => setCredentials({ ...credentials, us_password: e.target.value })}
                    />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>Login</Button>
          <Button className="w-full" onClick={handleFetchMe}>Fetch Me</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
