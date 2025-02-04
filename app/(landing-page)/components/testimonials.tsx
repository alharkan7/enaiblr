"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { apps } from "@/config/apps";
import Link from "next/link";
import { motion } from "framer-motion";

const testimonials = apps.map((app) => ({
  icon: app.icon,
  name: app.name,
  content: app.description,
  categories: [1],
}));

export default function Testimonials() {
  const [category, setCategory] = useState<number>(1);

  return (
    <section className="relative">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Our Works
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Try Our AI Apps
            </h2>
            <p className="text-lg text-indigo-200/65">
              We created Enaiblr AI Platform, a collection of AI apps that offer unlimited access to AI for everyone for free.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Link href="/apps" key={index} className="group">
                <Testimonial testimonial={testimonial}>
                  {testimonial.content}
                </Testimonial>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TestimonialProps {
  testimonial: {
    icon: LucideIcon;
    name: string;
    content: string;
  };
  children: React.ReactNode;
}

export function Testimonial({ testimonial, children }: TestimonialProps) {
  const Icon = testimonial.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="relative h-[170px] rounded-lg p-5 backdrop-blur-sm transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
      data-aos="fade-up"
      data-aos-anchor="[data-aos-id-testimonials]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="absolute top-4 right-4 pointer-events-none"
        animate={isHovered ? {
          scale: 1.6,
          rotate: 0,
        } : {
          scale: 0.5,
          rotate: 45,
        }}
        transition={{ duration: 0.2 }}
      >
        <ArrowUpRight className="w-7 h-7 text-indigo-500/70" />
      </motion.div>
      <div className="flex h-full flex-col gap-4">
        <div>
          <Icon className="h-7 w-7 text-indigo-500" />
        </div>
        <div>
          <div className="font-bold text-indigo-200">{testimonial.name}</div>
        </div>
        <p className="text-indigo-200/65 line-clamp-4">
          {children}
        </p>
      </div>
    </article>
  );
}
