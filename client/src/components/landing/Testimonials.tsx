import Image from "next/image";

export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      role: "Software Engineer at Google",
      image: "/testimonials/john.jpg",
      quote: "Virasat helped me connect with amazing mentors who guided me through my career transition.",
    },
    {
      name: "Jane Smith",
      role: "Product Manager at Microsoft",
      image: "/testimonials/jane.jpg",
      quote: "The networking opportunities through Virasat have been invaluable for my professional growth.",
    },
    {
      name: "Mike Johnson",
      role: "Data Scientist at Amazon",
      image: "/testimonials/mike.jpg",
      quote: "I found my dream job through Virasat's exclusive job opportunities.",
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Alumni Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-background/30 backdrop-blur-lg p-6 rounded-xl border border-white/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 