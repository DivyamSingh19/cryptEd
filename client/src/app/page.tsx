import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
 
 
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container"; 
 
import {
 
  CircleArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-secondary">
      {/* Header */}
      <Navbar />

      {/* Home Section */}
      <section className="flex py-16 relative">
        <Container>
          <div className="grid grid-cols-2 items-start pl-4">
            <div className="flex flex-col gap-2 z-10">
              <h1 className="text-5xl font-bold">
                Welcome to <span className="text-primary">Axoma</span>
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

      

      {/* Footer */}
      <Footer />
    </div>
  );
}
