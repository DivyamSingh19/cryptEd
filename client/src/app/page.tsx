import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import AlumniCard from "@/components/landing/AlumniCard";
import EventCard from "@/components/landing/EventCard";
import JobCard from "@/components/landing/JobCard";
import { PartnerSlider } from "@/components/landing/PartnerSlider";
import Testimonials from "@/components/landing/Testimonials";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowRight,
  CircleArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-secondary">
      {/* Header */}
      <Header />

      {/* Home Section */}
      <section className="flex py-16 relative">
        <Container>
          <div className="grid grid-cols-2 items-start pl-4">
            <div className="flex flex-col gap-2 z-10">
              <h1 className="text-5xl font-bold">
                Welcome to <span className="text-primary">Virasat</span>
              </h1>
              <h2 className="text-4xl font-semibold">Connect, Learn, Grow.</h2>
              <p className="text-xl mt-4 mb-8">
                Building lifelong connections through a seamless alumni
                networking experience.
              </p>
              <Button
                size="lg"
                className="rounded-full w-44 p-6 hover:shadow-md"
                asChild
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-lg">Get Started</span>
                  <CircleArrowRight className="-rotate-45" />
                </Link>
              </Button>
            </div>
            <div className="z-10">
              <Image
                src="/hero-img.png"
                alt="hero image"
                width="600"
                height="600"
              />
            </div>
          </div>
          <div className="absolute bottom-4 left-0 w-full bg-no-repeat bg-cover bg-[url(/gradient-landing.svg)] h-[500px]"></div>

          <div className="">
            <div className="grid grid-cols-8 grid-rows-4 gap-4 p-4 -mt-56">
              <Link
                href="#"
                className="col-span-2 row-span-4 bg-background/30 backdrop-blur-lg p-4 text-xl font-medium rounded-xl border border-white/20 hover:bg-background/40"
              >
                One-on-One Mentorship with Alumni
                <Image src="/mask.png" alt="" width="500" height="500" />
              </Link>
              <Link
                href="#jobs"
                className="relative bg-background/30 backdrop-blur-lg p-4 text-xl col-span-2 row-span-2 col-start-3 font-medium rounded-xl border border-white/20 hover:bg-background/40"
              >
                Exclusive Job & Internship Opportunities
                <Image
                  src="/Jobs.png"
                  alt=""
                  width="120"
                  height="120"
                  className="absolute bottom-0 right-0"
                />
              </Link>
              <Link
                href="#"
                className="relative bg-background/30 backdrop-blur-lg p-4 text-xl col-span-2 row-span-2 col-start-3 font-medium row-start-3 rounded-xl border border-white/20 hover:bg-background/40"
              >
                Engage in Meaningful Discussions
                <Image
                  src="/forums.png"
                  alt=""
                  width="100"
                  height="100"
                  className="absolute bottom-0 right-0"
                />
              </Link>
              <Link
                href="#events"
                className="relative bg-background/30 backdrop-blur-lg p-4 text-xl col-span-2 row-span-2 col-start-5 font-medium row-start-3 rounded-xl border border-white/20 hover:bg-background/40"
              >
                Live Events & Webinars
                <Image
                  src="/live-events.png"
                  alt=""
                  width="80"
                  height="80"
                  className="absolute bottom-3 right-3"
                />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* MOUs */}
      <PartnerSlider />

      {/* Search Alumni Section */}
      <section id="search-alumni" className="mb-20">
        <Container>
          <h1 className="font-bold text-center text-5xl mt-10 mb-14">Find your Mentors</h1>
          <div>
            <div className="flex gap-6">
              <Input type="search" placeholder="Search Alumni" className="bg-background p-4 text-xl" />
              <Select>
                <SelectTrigger className="w-[280px] bg-background">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[280px] bg-background">
                  <SelectValue placeholder="Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Alumni Card */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 my-6">
              <AlumniCard 
                name="Satyam Bhosale"
                role="UI/UX Designer"
                company="Apple"
                exp="1"
                image="/alumni/boi1.jpg"
                prevComp="/alumni/alumni1company.png"
              />
              <AlumniCard 
                name="Mitesh Kamthe"
                role="Cybersecurity Expert"
                company="Google"
                exp="2"
                image="/alumni/boi2.jpg"
                prevComp="/alumni/alumni2company.png"
              />
              <AlumniCard 
                name="Aditya Sharma"
                role="Software Engineer"
                company="Microsoft"
                exp="3"
                image="/alumni/boi3.jpg"
                prevComp="/alumni/alumni3company.png"
              />
              <AlumniCard 
                name="Divyam Singh"
                role="Backend Developer"
                company="Amazon"
                exp="1"
                image="/alumni/boi4.jpg"
                prevComp="/alumni/alumni4company.png"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="px-6 py-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold">
                  Latest Jobs/Internships
                </h2>
                <p className="text-gray-600 text-lg">
                  We provide the tools, resources, and community support needed
                  to turn innovative ideas into reality. Join us in shaping the
                  future of technology and leadership.
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 bg-[#448aff] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View All Opportunities <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <JobCard
                title="Frontend Developer"
                company="Tech Solutions Inc."
                type="Full-time"
              />
              <JobCard
                title="UX Design Intern"
                company="Creative Labs"
                type="Internship"
              />
              <JobCard
                title="Product Manager"
                company="Innovation Hub"
                type="Remote"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="search-alumni" className="mb-20">
        <Container>
          <h1 className="font-bold text-center text-5xl mt-16 mb-14">Upcoming Events</h1>
          <div>
            {/* Events Card */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-6 my-6">
              <EventCard 
                name="Mind Matters A Guide to Stress Free Life"
                date="March 05, 2024"
                type="Career Guidance / Placement Guidance"
                image="/events/event1.jpg"
              />
              <EventCard 
                name="Hr-Meet 2024 (Meet with a Purpose)"
                date="February 21, 2024"
                type="Career Guidance / Placement Guidance"
                image="/events/event2.jpg"
              />
              <EventCard 
                name="How to leverage LinkedIn for Professional Careers and Success"
                date="8 February 2024"
                type="Career Guidance / Placement Guidance"
                image="/events/event3.jpg"
              />
              <EventCard 
                name="Mind Matters A Guide to Stress Free Life"
                date="6 February 2024"
                type="Career Guidance / Placement Guidance"
                image="/events/event4.jpg"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-2 bg-white">
        <Testimonials />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
