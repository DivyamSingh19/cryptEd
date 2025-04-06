import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AlumniCardProps {
  name: string;
  role: string;
  company: string;
  exp: string;
  image: string;
  prevComp: string;
}

export default function AlumniCard({
  name,
  role,
  company,
  exp,
  image,
  prevComp,
}: AlumniCardProps) {
  return (
    <div className="bg-background/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-background/40 transition-all">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{name}</h3>
          <p className="text-gray-600">{role}</p>
          <div className="flex items-center gap-2 mt-2">
            <Image
              src={prevComp}
              alt={`${company} logo`}
              width={24}
              height={24}
              className="rounded"
            />
            <span className="text-sm">{company}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{exp} years of experience</p>
        </div>
      </div>
      <Button className="w-full mt-4" variant="outline">
        Connect
      </Button>
    </div>
  );
} 