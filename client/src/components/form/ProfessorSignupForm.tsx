"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
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
import Image from "next/image";

const professorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  university_id: z.string().min(1, { message: "University ID is required." }),
  university_name: z
    .string()
    .min(1, { message: "University name is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  walletAddress: z.string().min(42, { message: "Invalid wallet address." }),
});

const ProfessorSignupForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof professorFormSchema>>({
    resolver: zodResolver(professorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      university_id: "",
      university_name: "",
      department: "",
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

  const onSubmit = async (values: z.infer<typeof professorFormSchema>) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:4000/api/user/register-professor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            university_id: values.university_id,
            university_name: values.university_name,
            department: values.department,
            walletAddress: values.walletAddress,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully");
        router.push("/dashboard/professor");
      } else {
        toast.error(data.message || "Error in creating account");
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Doe" {...field} />
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
                    placeholder="john.doe@university.edu"
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="university_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University ID</FormLabel>
                <FormControl>
                  <Input placeholder="U12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="university_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>University Name</FormLabel>
                <FormControl>
                  <Input placeholder="IIT Bombay" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Computer Science" {...field} />
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

        {/* MetaMask Connect Button */}
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
            <LoaderSpinner message="Creating..." color="white" />
          ) : (
            "Sign Up as Professor"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfessorSignupForm;
