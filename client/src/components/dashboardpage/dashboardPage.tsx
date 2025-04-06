"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ClipboardCheck, FilePlus, FileText, Timer } from "lucide-react";
import { 
    UserCog,
    ShieldCheck, 
 
   
    UploadCloud, 
 
    KeyRound, 
    BarChart2 
  } from 'lucide-react';
  
import Image from "next/image";

type Role = "student" | "professor"  | "admin";

type CardData = {
  title: string;
  desc: string;
  icon: React.ElementType;
};

const roleData: Record<Role, {
  title: string;
  subtitle: string;
  cards: CardData[];
}> = {
    student: {
        title: "Student Dashboard",
        subtitle: "Access exams, submissions, and verified results securely.",
        cards: [
          { title: "Upcoming Exams", desc: "View schedule and authorized exams.", icon: Calendar },
          { title: "Submit Exams", desc: "Upload encrypted answers securely.", icon: FileText },
          { title: "Verified Results", desc: "View blockchain-verified exam results.", icon: ShieldCheck },
        ],
      },
      
      professor: {
        title: "Examiner Dashboard",
        subtitle: "Manage exam creation, review submissions, and store results.",
        cards: [
          { title: "Create Exams", desc: "Set up exams with encryption and timings.", icon: FilePlus },
          { title: "Review Submissions", desc: "View and evaluate student responses.", icon: ClipboardCheck },
          { title: "Publish Results", desc: "Store results with verification hashes.", icon: UploadCloud },
        ],
      },
      
      admin: {
        title: "Exam Admin Dashboard",
        subtitle: "Oversee verifiers, student access, and exam operations.",
        cards: [
          { title: "Manage Verifiers", desc: "Add or remove result verifiers.", icon: UserCog },
          { title: "Authorize Wallets", desc: "Grant or revoke student access.", icon: KeyRound },
          { title: "Exam Analytics", desc: "Track exams, submissions, and results.", icon: BarChart2 },
        ],
      }
      
};

const DashboardPage = ({ role, user }: { role: Role; user: { name: string } }) => {
  const { title, subtitle, cards } = roleData[role] || roleData.student;
  const now = new Date();
  const date = now.getDate();
  const month = now.toLocaleString("default", { month: "long" });
  const timeString = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="relative bg-primary/20 border border-primary/30 p-4 rounded-xl h-44 w-1/2">
        <h2 className="font-semibold text-2xl">
          Good Day, <span className="capitalize font-bold">{user.name} 👋</span>
        </h2>
        <p>Here are your daily overview and key updates</p>
        <div className="bg-sidebar/55 mt-4 border border-white/30 backdrop-blur-lg w-32 p-2 rounded-lg">
          <p className="flex items-center gap-2">
            <Calendar size={14} />
            {`${month} ${date}`}
          </p>
          <p className="flex items-center gap-2">
            <Timer size={14} />
            {`${timeString}`}
          </p>
        </div>
        <Image
          src="/assets/dashboarddineshdocs.svg"
          width={200}
          height={100}
          alt="dinesh"
          className="absolute bottom-0 right-0"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <CardHeader className="flex gap-4">
              <card.icon className="w-10 h-10 text-primary p-2 bg-primary/10 rounded-lg" />
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">{card.desc}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
