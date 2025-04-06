import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  name: string;
  date: string;
  type: string;
  image: string;
}

export default function EventCard({
  name,
  date,
  type,
  image,
}: EventCardProps) {
  return (
    <div className="bg-background/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:bg-background/40 transition-all">
      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-1">{date}</p>
      <p className="text-sm text-gray-500 mb-4">{type}</p>
      <Button className="w-full" variant="outline">
        Register Now
      </Button>
    </div>
  );
} 