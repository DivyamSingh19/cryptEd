"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    upcomingTests: 0,
    completedTests: 0,
    averageScore: 0,
  });
  const user = useSelector((state: { user: User }) => state.user);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
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
  );
};

export default StudentDashboard;
