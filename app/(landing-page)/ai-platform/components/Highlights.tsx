"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import hl1 from "../assets/hl-1.webp";
import hl2 from "../assets/hl-2.webp";
import hl3 from "../assets/hl-3.webp";
import hl4 from "../assets/hl-4.webp";
import hl5 from "../assets/hl-5.webp";

const features = [
  {
    title: "Access Any AI Models",
    image: hl1
  },
  {
    title: "Organize Chats in Folders & Pins",
    image: hl2
  },
  {
    title: "Private Google Login & Incognito Mode",
    image: hl3
  },
  {
    title: "Canvas/Artifacts for Documents & Coding",
    image: hl4
  },
  {
    title: "Bonus: Free AI Apps",
    image: hl5
  },
];

const Highlights = () => {
  return (
    <section id="highlights" className="py-24 overflow-hidden">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center w-full`}
            >
              <motion.div 
                className="w-full lg:w-1/2 max-w-full"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
              >
                <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {feature.title}
                </h2>
              </motion.div>
              <div className="w-full lg:w-1/2">
                <motion.div 
                  className="relative w-full outline outline-2 outline-sky-500 shadow-lg aspect-[4/3] rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
