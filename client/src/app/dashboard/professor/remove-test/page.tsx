// dashboard/professor/remove-test/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Trash2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Test {
  id: string;
  title: string;
  course: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  totalStudents?: number;
}

const RemoveTestPage = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/professor/tests");
        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await response.json();
        setTests(data);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError(err instanceof Error ? err.message : "Failed to load tests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleDelete = async (test: Test) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/professor/tests/${test.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete test");
      }

      setTests((prevTests) => prevTests.filter((t) => t.id !== test.id));
      setSelectedTest(null);
    } catch (err) {
      console.error("Error deleting test:", err);
      setError(err instanceof Error ? err.message : "Failed to delete test");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: Test["status"]) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-50";
      case "in-progress":
        return "text-yellow-600 bg-yellow-50";
      case "completed":
        return "text-green-600 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/professor">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Remove Tests</h1>
            <p className="text-gray-600">Manage and remove existing tests</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {tests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No tests available</p>
            </CardContent>
          </Card>
        ) : (
          tests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{test.title}</CardTitle>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      test.status
                    )}`}
                  >
                    {test.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Course: {test.course}</span>
                    <span>
                      {test.totalStudents !== undefined &&
                        `${test.totalStudents} students enrolled`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Start: {new Date(test.startTime).toLocaleString()}
                    </span>
                    <span>End: {new Date(test.endTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedTest(test)}
                      disabled={test.status === "in-progress"}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Test Removal
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{selectedTest?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedTest(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedTest && handleDelete(selectedTest)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Test"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RemoveTestPage;
