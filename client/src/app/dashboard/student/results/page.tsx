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

interface TestResult {
  id: string;
  title: string;
  course: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  status: "completed" | "reviewed";
}

const StudentResults = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const user = useSelector((state: { user: User }) => state.user);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // TODO: Replace with actual API call
        const response = await fetch("/api/student/test-results");
        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Failed to fetch results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const calculatePerformanceMetrics = () => {
    if (results.length === 0)
      return { averageScore: 0, totalTests: 0, bestScore: 0 };

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / results.length;
    const bestScore = Math.max(...results.map((result) => result.score));

    return {
      averageScore: Math.round(averageScore),
      totalTests: results.length,
      bestScore,
    };
  };

  const metrics = calculatePerformanceMetrics();

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
          <h1 className="text-2xl font-bold">Test Results</h1>
          <p className="text-gray-600">
            View your performance and test history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.averageScore}%</p>
            <p className="text-sm text-gray-600">Across all tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tests Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.totalTests}</p>
            <p className="text-sm text-gray-600">Total tests taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{metrics.bestScore}%</p>
            <p className="text-sm text-gray-600">Highest achievement</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test History</h2>
        {results.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">No test results available</p>
            </CardContent>
          </Card>
        ) : (
          results.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <CardTitle>{result.title}</CardTitle>
                <p className="text-sm text-gray-600">{result.course}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-2xl font-bold">{result.score}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Correct Answers</p>
                    <p className="text-2xl font-bold">
                      {result.correctAnswers}/{result.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time Spent</p>
                    <p className="text-2xl font-bold">{result.timeSpent} min</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button>View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentResults;
