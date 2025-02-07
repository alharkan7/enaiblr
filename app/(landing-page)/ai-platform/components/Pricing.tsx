"use client"

import { Check, ChevronDown, ChevronUp } from "lucide-react";
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
import { priceUS, originalPriceUS, discountValueUS, PRO_FEATURES, FREE_FEATURES } from "@/lib/constants";
import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const formatPrice = (amount: number) => {
  return `$${amount.toLocaleString('en-US')}`;
};

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Best for New Users",
    features: FREE_FEATURES,
  },
  {
    name: "Unlimited Access",
    price: priceUS,
    description: "Access All Unlimited AI Features",
    features: PRO_FEATURES,
    popular: true,
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

const Pricing = () => {
  const [expandedPlan, setExpandedPlan] = React.useState<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const toggleExpand = (index: number) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  return (
    <section id="pricing" className="py-20 backdrop-blur-xs">
      <div className="container px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Single &
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Affordable Pricing
            </span> {" "}
          </h2>
          <p>
            Complete and Unlimitted AI Features with <b>the Most Affordable Price.</b>
          </p>
        </motion.div>
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 max-w-3xl mx-auto"
        >
          {[...plans].sort((a, b) => (
            isDesktop 
              ? (a.popular ? 1 : -1) 
              : (a.popular ? -1 : 1)
          )).map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={item}
              whileHover={plan.popular ? { scale: 1.03 } : { scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={cn(
                  "relative flex flex-col h-full bg-white",
                  plan.popular
                    ? "border-blue-600 shadow-lg scale-105"
                    : "border-border"
                )}
              >
                {plan.popular && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-3.5 left-0 right-0 flex justify-center"
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 !text-white px-2.5 py-0.5 rounded-full text-sm font-medium">
                      enaiblr
                    </span>
                  </motion.div>
                )}
                <CardHeader className="text-center !text-black">
                  <CardTitle className="mt-4">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col grow">
                  {plan.popular && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-3 text-center"
                    >
                      <span className="text-xl text-muted-foreground relative">
                        <span className="relative">
                          {formatPrice(originalPriceUS)}
                          <span className="absolute left-0 right-0 top-1/2 border-t-2 border-current transform -rotate-12" />
                        </span>
                        <motion.span 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="ml-2 text-xs bg-blue-400/90 text-white px-2 py-1 rounded-full"
                        >
                          {discountValueUS}% Off
                        </motion.span>
                      </span>
                    </motion.div>
                  )}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 text-center"
                  >
                    <span className="text-4xl !text-black font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-muted-foreground">{plan.price === 0 ? "" : "/month"}</span>
                  </motion.div>
                  <div className="relative">
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
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          {expandedPlan === index ? (
                            <>
                              <ChevronUp className="size-4" />
                              <span>Show Less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-5" />
                              <span>Show All Features</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link href={plan?.popular ? "/payment" : "/apps"} className="w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full rounded-lg px-4 py-2",
                        plan?.popular
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full"
                          : "border border-gray-200 bg-white text-black rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:border-transparent",
                      )}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
