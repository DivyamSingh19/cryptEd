import { Button } from "@/components/ui/button";

interface JobCardProps {
  title: string;
  company: string;
  type: string;
}

export default function JobCard({
  title,
  company,
  type,
}: JobCardProps) {
  return (
    <div className="bg-background/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-background/40 transition-all">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-1">{company}</p>
      <p className="text-sm text-gray-500 mb-4">{type}</p>
      <Button className="w-full" variant="outline">
        Apply Now
      </Button>
    </div>
  );
} 