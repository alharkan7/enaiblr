"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold mb-4"
          >
            Join
            {" "}
            <span 
              className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-[length:200%_100%] bg-clip-text text-transparent"
            >
              Right Now
            </span> {" "}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            It only takes <b className="text-black/80">1 minute</b> to Login and share your referral link.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:opacity-90 rounded-full group" asChild>
                <Link href="/account/affiliate">
                  Join Affiliate 
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="size-4 text-white" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="rounded-full text-black hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-600 hover:text-white hover:border-transparent" asChild>
                <a href="mailto:mail@enaiblr.org" target="_blank" rel="noopener noreferrer">Contact Us</a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;