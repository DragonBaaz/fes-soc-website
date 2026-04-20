"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="bg-[#F7F5F0]">
      {/* Hero Content */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-12">
          {/* Left Side: Buttons at the bottom */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-end pb-4 order-2 lg:order-1">
            <div className="flex flex-row items-center justify-center gap-4 w-full">
              <Button asChild size="lg" className="bg-[#1B4332] text-white hover:bg-[#2D6A4F] px-8">
                <Link href="/dashboard">Explore Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332]/5 px-8">
                <Link href="/framework">Read Framework</Link>
              </Button>
            </div>
          </div>

          {/* Right Side: Heading and Subheading */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center order-1 lg:order-2">
            <div className="inline-block p-4 border-4 rounded-xl animate-soc-border mb-6 border-transparent">
              <h1 className="text-4xl font-bold tracking-tight text-[#1B4332] sm:text-5xl lg:text-6xl">
                Shared-Outcome Commons Policy Diagnostic
              </h1>
            </div>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl max-w-lg mx-auto">
              Evaluating whether Chhattisgarh government schemes structurally function as commons-based economic opportunities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
