"use client"

import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { originalPrice,PRO_FEATURES } from "@/lib/constants";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const formatPrice = (amount: number) => {
  return `$${amount.toLocaleString('en-US')}`;
};

const discountValue = 25;

const plans = [
  {
    name: "4 Months Access",
    description: "Access All AI Features without Limits",
    features: PRO_FEATURES,
    price: 9,
    commission: 25,
    commissionValue: Math.ceil(9 * 0.25)
  },
  {
    name: "1 Month Access",
    description: "Best for New Users",
    features: PRO_FEATURES,
    price: 3,
    commission: 25,
    commissionValue: Math.ceil(3 * 0.25) 
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Product = () => {
  const [expandedPlan, setExpandedPlan] = React.useState<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const toggleExpand = (index: number) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  return (
    <section id="product" className="py-20 backdrop-blur-xs">
      <div className="container px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            The Product:
            {" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Enaiblr Pro
            </span> {" "}
          </h2>
          <p className="text-lg">
            The Complete and Unlimited AI Platform with the Most Affordable Price.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 max-w-3xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={item}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={cn(
                  "relative flex flex-col h-full bg-white border-yellow-500 shadow-lg scale-105"
                )}
              >
                <CardHeader className="text-center !text-black">
                  <CardTitle>{plan.name}</CardTitle>
                  {/* <CardDescription>{plan.description}</CardDescription> */}
                </CardHeader>
                <CardContent className="flex flex-col grow">

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <span className="text-4xl !text-black font-bold">{formatPrice(plan.price)}</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-4 text-center"
                  >
                    <span className="text-xl text-muted-foreground relative">
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="ml-2 text-xs bg-yellow-400/90 text-black px-2 py-1 rounded-full"
                      >
                        Commission ≈ <b>{formatPrice(plan.commissionValue)}</b>
                      </motion.span>
                    </span>
                  </motion.div>

                  <div className="relative mt-4">
                    <AnimatePresence mode="wait">
                      <motion.ul
                        key={expandedPlan === index ? 'expanded' : 'collapsed'}
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.05
                            }
                          }
                        }}
                        className={cn(
                          "space-y-2 max-w-[90%] mx-auto",
                          plan.features.length > 8 && expandedPlan !== index && "mask-linear-gradient",
                          plan.features.length > 8 && expandedPlan === index && "pb-12"
                        )}
                      >
                        {plan.features.slice(0, expandedPlan === index ? undefined : 8).map((feature, i) => (
                          <motion.li
                            key={i}
                            variants={{
                              hidden: { opacity: 0, x: -20 },
                              show: { opacity: 1, x: 0 }
                            }}
                            className="flex items-center gap-2"
                          >
                            <Check className="size-4 !text-black/80" />
                            <span className="!text-black/80 text-sm">{feature}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                    {plan.features.length > 8 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={cn(
                          "absolute bottom-0 left-0 right-0 pt-8 pb-2 max-w-[90%] mx-auto",
                          expandedPlan === index ? "" : "bg-gradient-to-t from-white via-white/80 to-transparent"
                        )}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleExpand(index)}
                          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 text-sm"
                        >
                          {expandedPlan === index ? (
                            <>
                              <ChevronUp className="size-4" />
                              <span>Show Less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-5" />
                              <span>Show All</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                {/* <CardFooter className="mt-auto">
                  <Link href="/account/affiliate" className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:opacity-90 rounded-full"
                    >
                      Mulai Affiliate
                    </motion.button>
                  </Link>
                </CardFooter> */}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Product;
