"use client";
import React from "react";
import LoginForm from "@/components/form/LoginForm";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  // const router = useRouter();

  // useEffect(() => {
  //   // Ensure this runs only in the client
  //   if (typeof window !== "undefined") {
  //     const role = localStorage.getItem("userRole");
  //     if (role) {
  //       router.push("/");
  //     }
  //   }
  // }, [router]);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen pt-32 pb-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 0.5px 0.5px, rgba(6,182,212,0.3) 0.5px, transparent 0)",
        backgroundSize: "8px 8px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
      </div>

      <Button className="absolute top-5 left-5" variant="secondary" asChild>
        <Link href="/">Back to home</Link>
      </Button>

      {/* Future use: */}
      {/* 
      <div className="absolute bottom-20 right-10 -z-10">
        <Image src="/assets/illustration_1.svg" width={600} height={600} alt="Illustration" />
      </div>
      */}
    </div>
  );
}
