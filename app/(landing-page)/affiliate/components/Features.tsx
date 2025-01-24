"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { apps } from "@/config/apps";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const AppCard = ({ app }: { app: typeof apps[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      variants={item}
      className="w-full md:w-[calc(50%-1rem)] lg:w-[280px]"
    >
      <Link href={`/apps`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white text-black relative overflow-hidden h-[200px]">
            <CardHeader>
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg mb-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
              >
                <app.icon className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-lg font-semibold mb-2">{app.name}</CardTitle>
              <CardDescription className="line-clamp-3 text-sm">{app.description}</CardDescription>
              <motion.div 
                className="absolute top-4 right-4 pointer-events-none"
                animate={isHovered ? {
                  scale: 1,
                  rotate: 0,
                } : {
                  scale: 0.4,
                  rotate: 45,
                }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="w-14 h-14 !text-yellow-500/70 hover:!text-yellow-500" />
              </motion.div>
            </CardHeader>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 backdrop-blur-xs">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            {" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Bikin Konten
            </span> {" "}
            dari Semua Fiturnya. Gratis.
          </h2>
          <p className="text-lg text-muted-foreground">
            Kamu bisa mencoba semua fitur yang ada di Enaiblr Platform, kemudian bagikan kontennya untuk membuat <b className="text-black/80">referral-mu semakin menarik</b>.
          </p>
        </motion.div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8"
        >
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
