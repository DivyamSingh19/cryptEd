"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoaderSpinner from "./LoaderSpinner";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  walletAddress: z.string().min(42, { message: "Invalid wallet address." }),
});

const StudentSignupForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
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

  const onSubmit = async (values: z.infer<typeof studentFormSchema>) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/user/register/student", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", UserRole.STUDENT); 
        localStorage.setItem("walletAddress", data.metaData.walletAddress);
        localStorage.setItem("email", data.metaData.email);
        localStorage.setItem("name", data.metaData.name);
        localStorage.setItem("id", data.id);
        toast.success("Account created successfully");

        router.push("/dashboard/student"); 
        dispatch(
          setUser({
            id: data.token,
            role: data.role,
            name: data.metaData.name,
            email: data.metaData.email,
            walletAddress: data.metaData.walletAddress,
          })
        );
      } else {
        toast.error("Error in creating account");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Error in creating account: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Student" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="jane.student@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        {/* MetaMask Wallet Connection */}
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
                .slice(0, 6)}...${form.getValues("walletAddress").slice(-4)}`
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
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <LoaderSpinner message="Signing up..." color="white" />
          ) : (
            "Sign Up as Student"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StudentSignupForm;
