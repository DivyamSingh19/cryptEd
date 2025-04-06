"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { UserRole } from "@/types";
import { Loader2 } from "lucide-react";

interface User {
  email: string;
  name?: string;
  role: UserRole;
}

const DashboardPage = () => {
  const router = useRouter();
  const user = useSelector((state: { user: User }) => state.user);

  useEffect(() => {
    if (!user) return;

    // Redirect based on user role
    switch (user.role) {
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
        router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto" />
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
