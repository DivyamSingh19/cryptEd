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

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoaderSpinner from "./LoaderSpinner";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { UserRole } from "@/types";
import { setUser } from "@/redux/userSlice";
import axios from "axios";

const collegeAdminFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(8, { message: "Min 8 characters required." }),
  college_id: z.string().min(1, { message: "College ID is required." }),
  college_name: z.string().min(1, { message: "College name is required." }),
  walletAddress: z.string().min(42, { message: "Invalid wallet address." }),
});

const CollegeAdminSignupForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.COLLEGE_ADMIN);

  const form = useForm<z.infer<typeof collegeAdminFormSchema>>({
    resolver: zodResolver(collegeAdminFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      college_id: "",
      college_name: "",
      walletAddress: "",
    },
  });

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        form.setValue("walletAddress", accounts[0]);
        toast.success(`Connected to MetaMask: ${accounts[0]}`);
      }
    } catch (err) {
      console.error("MetaMask error:", err);
      toast.error("Failed to connect to MetaMask.");
    }
  };

  const onSubmit = async (values: z.infer<typeof collegeAdminFormSchema>) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:4000/login",
        {
          name: values.name,
          email: values.email,
          password: values.password,
          college_id: values.college_id,
          college_name: values.college_name,
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", UserRole.COLLEGE_ADMIN);
        localStorage.setItem("walletAddress", data.metaData.walletAddress);
        localStorage.setItem("email", data.metaData.email);
        localStorage.setItem("name", data.metaData.name);
        localStorage.setItem("id", data.id);

        dispatch(
          setUser({
            id: data.token,
            role: data.role,
            name: data.metaData.name,
            email: data.metaData.email,
            walletAddress: data.metaData.walletAddress,
          })
        );

        toast.success("Admin registered successfully!");
        router.push("/dashboard/college-admin");
      } else {
        toast.error("Signup failed", data.message);
      }
    } catch (error: any) {
      toast.error(`Registration error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Prof. John Doe" {...field} />
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
                    placeholder="admin@college.edu"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="college_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College ID</FormLabel>
                <FormControl>
                  <Input placeholder="CLG12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="college_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Name</FormLabel>
                <FormControl>
                  <Input placeholder="XYZ Engineering College" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <FormControl>
                <Input type="text" readOnly {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* MetaMask Button */}
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
                <span>Connect MetaMask</span>
                <Image
                  src="/metamask-icon.svg"
                  width={24}
                  height={24}
                  alt="MetaMask Logo"
                />
              </div>
            )}
          </Button>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <LoaderSpinner message="Registering..." color="white" />
          ) : (
            "Sign Up as College Admin"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CollegeAdminSignupForm;
