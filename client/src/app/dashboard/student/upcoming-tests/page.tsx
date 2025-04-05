"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";

interface User {
  email: string;
  name?: string;
  role: string;
}

interface Test {
  id: string;
  title: string;
  course: string;
  date: string;
  duration: number;
  status: "scheduled" | "in-progress" | "completed";
}

const UpcomingTests = () => {
  const [filter, setFilter] = useState<"all" | "this-week" | "next-week">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState<Test[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: { user: User }) => state.user);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await fetch("/api/student/upcoming-tests");
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch tests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredTests = tests.filter((test) => {
    const testDate = new Date(test.date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case "this-week":
        return testDate <= nextWeek;
      case "next-week":
        return (
          testDate > nextWeek &&
          testDate <= new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
        );
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/student">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Upcoming Tests</h1>
          <p className="text-gray-600">
            View and prepare for your scheduled tests
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Tests
        </Button>
        <Button
          variant={filter === "this-week" ? "default" : "outline"}
          onClick={() => setFilter("this-week")}
        >
          This Week
        </Button>
        <Button
          variant={filter === "next-week" ? "default" : "outline"}
          onClick={() => setFilter("next-week")}
        >
          Next Week
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredTests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No upcoming tests scheduled</p>
            </CardContent>
          </Card>
        ) : (
          filteredTests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <CardTitle>{test.title}</CardTitle>
                <p className="text-sm text-gray-600">{test.course}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">
                      Date: {new Date(test.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {test.duration} minutes
                    </p>
                  </div>
                  <Button>View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingTests;
