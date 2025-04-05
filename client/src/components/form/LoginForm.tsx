"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import RoleSelector from "./RoleSelector";
import { Separator } from "../ui/separator";
import LoaderSpinner from "./LoaderSpinner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { toast } from "sonner";
import { UserRole } from "@/types";
import axios from "axios";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  walletAddress: z.string().min(42, { message: "Invalid wallet address." }),
});

const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationSuccess = searchParams.get("registration") === "success";
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      walletAddress: "",
    },
  });

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install it.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        form.setValue("walletAddress", accounts[0]);
        toast.success(`Connected: ${accounts[0]}`);
      }
    } catch (error) {
      console.error("MetaMask connection error:", error);
      toast.error("Failed to connect to MetaMask.");
    }
  };

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      setLoading(true);
      setAuthError(null);

      let endpoint = "";
      switch (selectedRole) {
        case UserRole.STUDENT:
          endpoint = "/api/auth/login-student";
          break;
        case UserRole.PROFESSOR:
          endpoint = "/api/auth/login-professor";
          break;
        case UserRole.ADMIN:
          endpoint = "/api/admin/login";
          break;
        default:
          endpoint = "/api/auth/login-student";
      }

      const response = await axios.post(
        `http://localhost:4000${endpoint}`,
        {
          email: values.email,
          password: values.password,
          walletAddress: values.walletAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.data?.token || data.token);
        localStorage.setItem("role", selectedRole);
        localStorage.setItem(
          "walletAddress",
          data.data?.walletAddress || values.walletAddress
        );
        localStorage.setItem("email", data.data?.email || values.email);
        localStorage.setItem("name", data.data?.name || "");
        localStorage.setItem("id", data.data?.id || "");

        dispatch(
          setUser({
            id: data.data?.id || data.token,
            role: selectedRole,
            name: data.data?.name || "",
            email: data.data?.email || values.email,
            walletAddress: data.data?.walletAddress || values.walletAddress,
          })
        );

        toast.success("Login successful!");

        switch (selectedRole) {
          case UserRole.STUDENT:
            router.push("/dashboard/student");
            break;
          case UserRole.PROFESSOR:
            router.push("/dashboard/professor");
            break;
          case UserRole.ADMIN:
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/");
        }
      } else {
        setAuthError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(
        error?.response?.data?.message ||
          "An unexpected error occurred. Please try again later."
      );
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative w-full max-w-3xl mx-auto">
      {/* <div className="absolute -top-[136px] left-[70%]">
        <Image
          src="/assets/logindoc.svg"
          width={150}
          height={150}
          alt="Login Illustration"
        />
      </div> */}
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registrationSuccess && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Registration successful! Please login with your credentials.
            </AlertDescription>
          </Alert>
        )}
        {authError && (
          <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <RoleSelector
            selectedRole={selectedRole}
            setSelectedRole={(role) => setSelectedRole(role)}
          />
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={connectMetaMask}
                    className="w-full"
                  >
                    {form.getValues("walletAddress") ? (
                      `Connected: ${form
                        .getValues("walletAddress")
                        .slice(0, 6)}...${form
                        .getValues("walletAddress")
                        .slice(-4)}`
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Connect to MetaMask</span>
                        <Image
                          src="/metamask-icon.svg"
                          width={24}
                          height={24}
                          alt="Metamask Logo"
                        />
                      </div>
                    )}
                  </Button>
                </div> */}
              {/* </div> */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <LoaderSpinner message="Logging in..." color="white" />
                ) : (
                  `Login as ${selectedRole}`
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
