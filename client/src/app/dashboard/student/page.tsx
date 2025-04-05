"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Home,
  BookOpen,
  Award,
  Key,
  User,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface User {
  email: string;
  name?: string;
  role: string;
}

interface DashboardStats {
  upcomingTests: number;
  completedTests: number;
  averageScore: number;
}

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard/student", icon: Home },
  { name: "Upcoming Tests", href: "/dashboard/student/upcoming-tests", icon: BookOpen },
  { name: "Results", href: "/dashboard/student/results", icon: Award },
  { name: "Access Management", href: "/dashboard/student/access", icon: Key },
  { name: "Profile", href: "/dashboard/student/profile", icon: User },
  { name: "Settings", href: "/dashboard/student/settings", icon: Settings },
];

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    upcomingTests: 0,
    completedTests: 0,
    averageScore: 0,
  });
  const user = useSelector((state: { user: User }) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch("/api/student/dashboard-stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for mobile (overlay) */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-gray-50 border-r border-gray-200 shadow-sm transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h2 className="text-lg font-bold">Student Portal</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-4 py-6">
          <div className="flex flex-col mb-6 items-center">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              <User className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="font-medium">{user.name || user.email}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link href={item.href} key={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-gray-100 text-primary" 
                        : "hover:bg-gray-100 text-gray-600 hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto px-4 py-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-white px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 lg:hidden" 
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Student Dashboard</h1>
        </header>
        
        {/* Main content area */}
        <main className="p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome, {user.name || user.email}!
              </h1>
              <p className="text-gray-600">Student Dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/dashboard/student/upcoming-tests">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>Upcoming Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      View your scheduled tests and exams
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/student/results">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Check your test results and performance
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/student/access">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>Access Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Manage your access permissions</p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.upcomingTests}</p>
                    <p className="text-sm text-gray-600">Scheduled tests</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.completedTests}</p>
                    <p className="text-sm text-gray-600">Tests completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.averageScore}%</p>
                    <p className="text-sm text-gray-600">Overall performance</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;