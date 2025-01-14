"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

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

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
          Cerita 
          {" "} 
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Pengalaman Pengguna
            </span>{" "}
            </h2>
          <p className="text-muted-foreground">
            Platform kami mendukung pengguna dari berbagai profesi dan industri.
          </p>
        </motion.div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:px-16"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={item}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-none shadow-lg bg-white">
                  <CardHeader>
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 * index }}
                      className="bg-white flex items-center gap-4"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Avatar>
                          <AvatarImage className="bg-white" src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-black">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 * index }}
                      className="text-muted-foreground"
                    >
                      {testimonial.content}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;