"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// import { motion as m } from "framer-motion";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
          >
            Access {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Unlimited AI
            </span>{" "}
            in One Platform
          </h1>
          <p 
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8 max-w-3xl mx-auto"
          >
            <b>ChatGPT, Claude, DeepSeek</b> + a Dozen of AI Features: All in One Place. <b>Unlimited Use, Affordable Price</b>, No Need to Pay for Each AI Separately.
          </p>
          <div 
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#highlights">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full">
                Get Started <ArrowRight className="size-4" />
              </Button>
            </Link>
            {/* <Link href="#features">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto rounded-full text-black hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:border-transparent"
              >
                Lihat Fitur
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;