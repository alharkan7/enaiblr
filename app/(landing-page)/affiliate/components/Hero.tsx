"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
          >
            Get {" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Unlimited Passive Income
            </span>{" "}
            with <span className="font-light">Affiliate</span>
          </h1>
          <p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Get a <span className="font-semibold">25% commission</span> for every transaction + Enaiblr Pro Subscription. <span className="font-semibold">No Limits.</span>
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#benefits">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:opacity-90 rounded-full">
                Get Started <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;