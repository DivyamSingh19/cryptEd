import Image from "next/image";

export function PartnerSlider() {
  const partners = [
    { name: "Google", logo: "/partners/google.png" },
    { name: "Microsoft", logo: "/partners/microsoft.png" },
    { name: "Amazon", logo: "/partners/amazon.png" },
    { name: "Apple", logo: "/partners/apple.png" },
    { name: "Meta", logo: "/partners/meta.png" },
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-8">Our Partners</h2>
        <div className="flex items-center justify-center gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="relative w-32 h-16 grayscale hover:grayscale-0 transition-all"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 