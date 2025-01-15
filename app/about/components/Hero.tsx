"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion as m } from "framer-motion";

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
            Akses Seluruh {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI Tanpa Batas
            </span>{" "}
            dalam Satu Platform
          </h1>
          <p 
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Tingkatkan produktivitasmu dengan akses ke beragam jenis AI dalam satu akun. Harga terjangkau, tak perlu lagi membayar langganan satu per satu.
          </p>
          <div 
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/apps">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full">
                Mulai <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto rounded-full text-black hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:border-transparent"
              >
                Lihat Fitur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;