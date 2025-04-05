"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock, Unlock, Clock, Loader2 } from "lucide-react";

interface User {
  email: string;
  name?: string;
  role: string;
}

interface AccessRequest {
  id: string;
  testId: string;
  testTitle: string;
  course: string;
  status: "pending" | "approved" | "denied";
  requestDate: string;
  responseDate?: string;
  reason?: string;
}

const AccessManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const user = useSelector((state: { user: User }) => state.user);

  useEffect(() => {
    const fetchAccessRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await fetch("/api/student/access-requests");
        if (!response.ok) {
          throw new Error("Failed to fetch access requests");
        }
        const data = await response.json();
        setAccessRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch access requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccessRequests();
  }, []);

  const handleRequestAccess = async () => {
    try {
      setIsRequesting(true);
      // TODO: Replace with actual API call
      const response = await fetch("/api/student/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Add necessary request data
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit access request");
      }

      // Refresh the access requests list
      const updatedResponse = await fetch("/api/student/access-requests");
      const data = await updatedResponse.json();
      setAccessRequests(data);
    } catch (err) {
      console.error("Failed to submit access request:", err);
      // TODO: Show error toast
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusIcon = (status: AccessRequest["status"]) => {
    switch (status) {
      case "approved":
        return <Unlock className="h-5 w-5 text-green-500" />;
      case "denied":
        return <Lock className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: AccessRequest["status"]) => {
    switch (status) {
      case "approved":
        return "Access Granted";
      case "denied":
        return "Access Denied";
      default:
        return "Pending Approval";
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/student">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Access Management</h1>
          <p className="text-gray-600">Manage your test access permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request New Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Need access to a test? Submit a request to your professor for
              approval.
            </p>
            <Button onClick={handleRequestAccess} disabled={isRequesting}>
              {isRequesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Request Access"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Access Requests</h2>
        {accessRequests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No access requests found</p>
            </CardContent>
          </Card>
        ) : (
          accessRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{request.testTitle}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span
                      className={`text-sm font-medium ${
                        request.status === "approved"
                          ? "text-green-600"
                          : request.status === "denied"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{request.course}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Requested On</p>
                    <p className="text-gray-600">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  {request.responseDate && (
                    <div>
                      <p className="text-sm font-medium">Response On</p>
                      <p className="text-gray-600">
                        {new Date(request.responseDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                {request.reason && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Reason</p>
                    <p className="text-gray-600">{request.reason}</p>
                  </div>
                )}
                {request.status === "approved" && (
                  <div className="mt-4">
                    <Button>Start Test</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AccessManagement;
