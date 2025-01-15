"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Anindya",
    role: "Mahasiswa Pascasarjana",
    content: "Platform ini sangat membantu saya ngerjain tugas. Bisa coding, beri rekomendasi solusi, bahkan belajar konsep baru. Nilai matkul saya naik drastis sejak pakai enaiblr.",
    image: "app/favicon.ico",
  },
  {
    name: "Sarah",
    role: "Digital Marketer",
    content:
      "Website ini sangat membantu saya dalam menghasilkan ide konten, visual, dan copy dalam hitungan menit. Fitur AI-nya lengkap dan sangat membantu creative process saya.",
    image: "app/favicon.ico",
  },
  {
    name: "Wijaya",
    role: "Dosen & Peneliti",
    content:
      "Saya terkesan dengan kemudahan akses ke berbagai tools AI dalam satu platform ini. Sangat membantu untuk riset akademis dan membuat materi presentasi.",
    image: "app/favicon.ico",
  },
  {
    name: "Riza",
    role: "Content Creator",
    content: "AI Apps untuk kreatif yang ada di platform ini menghemat waktu saya. Sekarang bisa bikin konten visual dan audio dubbing dalam hitungan menit. Game changer!",
    image: "app/favicon.ico",
  },
  {
    name: "Budi",
    role: "Jurnalis",
    content: "Fitur transcriber membantu saya mentranskrip wawancara dengan cepat dan akurat. Web Chat juga berguna untuk fact-checking dan riset real-time data.",
    image: "app/favicon.ico",
  },
  {
    name: "Diana",
    role: "Mahasiswa",
    content: "Fitur Flashcard membantu saya memahami paper ilmiah dengan lebih mudah. Fitur private chat juga membuat saya tidak khawatir tulisan saya terlihat di internet.",
    image: "app/favicon.ico",
  },
  {
    name: "Hendra",
    role: "Penulis & Coach",
    content: "Saya sudah coba pakai semua fiturnya. Karena tiap AI ada kelebihannya, punya semua aksesnya di 1 platform ini bikin saya bisa menulis dan mengorganisir ide tanpa mengganggu flow.",
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
            <h2 className="text-3xl font-bold mb-4">
              Cerita {" "} 
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Pengalaman Pengguna
              </span>
            </h2>
            <p className="text-muted-foreground">
              Platform kami mendukung pengguna dari berbagai profesi dan industri.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative w-full overflow-hidden h-[400px] md:h-[300px]"
        >
          <div className="h-full">
            <motion.div 
              data-row="top"
              className="flex flex-col md:flex-row gap-8 w-full h-full md:h-auto overflow-y-auto md:overflow-visible [&::-webkit-scrollbar]:hidden"
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