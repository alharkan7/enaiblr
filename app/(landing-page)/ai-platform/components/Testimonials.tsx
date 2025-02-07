"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Andrew",
    role: "Graduate Student",
    content: "This platform has been a game-changer for my assignments. It helps with coding, suggests solutions, and even teaches new concepts. My grades have improved since I started using enaiblr.",
    image: "app/favicon.ico",
  },
  {
    name: "Sarah",
    role: "Digital Marketer",
    content: "This website helps me generate content ideas, visuals, and copy in minutes. The AI features are comprehensive and really enhance my creative process.",
    image: "app/favicon.ico",
  },
  {
    name: "William",
    role: "College Teacher & Researcher",
    content: "I'm impressed by how easily I can access various AI tools in one platform. It's incredibly helpful for academic research and creating presentation materials.",
    image: "app/favicon.ico",
  },
  {
    name: "Rachel",
    role: "Content Creator",
    content: "The creative AI apps on this platform save me so much time. Now I can create visual content and audio dubbing in minutes. Absolute game changer!",
    image: "app/favicon.ico",
  },
  {
    name: "Brian",
    role: "Journalist",
    content: "The transcriber feature helps me transcribe interviews quickly and accurately. The Web Chat is also great for fact-checking and real-time data research.",
    image: "app/favicon.ico",
  },
  {
    name: "Lana",
    role: "Student",
    content: "The Flashcard feature helps me understand scientific papers more easily. The private chat feature also ensures my writing stays off the internet, which I really appreciate.",
    image: "app/favicon.ico",
  },
  {
    name: "Henry",
    role: "Writer & Coach",
    content: "I've tried all the features. Since each AI has its strengths, having access to all of them in one platform helps me write and organize ideas without breaking my flow.",
    image: "app/favicon.ico",
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

const Testimonials = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="w-full">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our {" "} 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                User Stories
              </span>
            </h2>
            <p>
              Our Platform Supports Users <b>from Various Professions and Industries.</b>
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative w-full overflow-hidden h-[600px] md:h-[300px]"
        >
          <div className="h-full">
            <motion.div 
              data-row="top"
              className="flex flex-col md:flex-row gap-4 sm:gap-2 w-full h-full md:h-auto overflow-y-auto md:overflow-visible [&::-webkit-scrollbar]:hidden"
              animate={isDesktop ? {
                x: isPlaying ? ['0%', '-100%'] : '0%',
              } : {}}
              transition={isDesktop ? {
                x: {
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }
              } : {}}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {(isDesktop ? [...testimonials, ...testimonials] : testimonials).map((testimonial, index) => (
                <motion.div
                  key={`top-${index}`}
                  className="w-full md:w-[400px] shrink-0 max-w-full"
                >
                  <Card className="border-none shadow-lg bg-white h-full mx-4">
                    <CardHeader>
                      <div className="bg-white flex items-center gap-4">
                        <Avatar>
                          <AvatarImage className="bg-white" src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold">
                            {testimonial.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-black">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground break-words whitespace-normal">
                        {testimonial.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
