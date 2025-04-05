"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types";
import RoleSelector from "@/components/form/RoleSelector";
import ProfessorSignupForm from "@/components/form/ProfessorSignupForm";
import StudentSignupForm from "@/components/form/StudentSignupForm";
import Link from "next/link";
import CollegeAdminSignupForm from "@/components/form/CollegeAdminSignupForm";
import { Separator } from "@/components/ui/separator";
 
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  // const router = useRouter();

  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     router.push("/");
  //   }
  // }, []);

  const renderFormByRole = () => {
    switch (selectedRole) {
      case UserRole.STUDENT:
        return <StudentSignupForm />;
      case UserRole.PROFESSOR:
        return <ProfessorSignupForm />;
      case UserRole.ADMIN:
        return <CollegeAdminSignupForm />;
      default:
        return <StudentSignupForm />;
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-8">
      <Button className="absolute top-5 left-5" variant="secondary" asChild>
        <Link href="/">Back to home</Link>
      </Button>
      <div className="w-full max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Sign up to access the healthcare platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RoleSelector
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
              <Separator />
              {renderFormByRole()}
              <div className="text-sm text-center text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
