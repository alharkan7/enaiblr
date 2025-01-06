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
import { price, originalPrice, PRO_FEATURES, FREE_FEATURES } from "@/lib/constants";
import React from 'react';

const formatPrice = (amount: number) => {
  return `Rp${amount.toLocaleString('id-ID')}`;
};

const plans = [
  {
    name: "Gratis",
    price: 0,
    description: "Cocok untuk Pengguna Baru",
    features: FREE_FEATURES,
  },
  {
    name: "Unlimited Access",
    price: price,
    description: "Akses Semua Fitur AI Tanpa Batas",
    features: PRO_FEATURES,
    popular: true,
  },
  // {
  //   name: "Enterprise",
  //   price: "$199",
  //   description: "For large organizations",
  //   features: [
  //     "Unlimited team members",
  //     "Enterprise analytics",
  //     "24/7 phone support",
  //     "Unlimited projects",
  //     "Custom integrations",
  //     "Dedicated account manager",
  //   ],
  // },
];

const Pricing = () => {
  const [expandedPlan, setExpandedPlan] = React.useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  return (
    <section id="pricing" className="py-20 backdrop-blur-xs">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Harga Tunggal dan
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Terjangkau
            </span> {" "}
          </h2>
          <p className="text-muted-foreground">
            Fitur AI terlengkap dan tanpa batas dengan harga paling murah.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "relative flex flex-col h-full bg-white",
                plan.popular
                  ? "border-blue-600 shadow-lg scale-105"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 !text-white px-3 py-1 rounded-full text-sm font-medium">
                    enaiblr
                  </span>
                </div>
              )}
              <CardHeader className="text-center !text-black">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col grow">
                {plan.popular && (
                  <div className="mb-3 text-center">
                    <span className="text-xl text-muted-foreground relative">
                      <span className="relative">
                        {formatPrice(originalPrice)}
                        <span className="absolute left-0 right-0 top-1/2 border-t-2 border-current transform -rotate-12" />
                      </span>
                      <span className="ml-2 text-xs bg-blue-400/90 text-white px-2 py-1 rounded-full">Disc. 60%</span>
                    </span>
                  </div>
                )}
                <div className="mb-4 text-center">
                  <span className="text-4xl !text-black font-bold">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground">{plan.price === 0 ? "" : "/bulan"}</span>
                </div>
                <div className="relative">
                  <ul className={cn(
                    "space-y-2 max-w-[90%] mx-auto",
                    plan.features.length > 8 && expandedPlan !== index && "mask-linear-gradient",
                    plan.features.length > 8 && expandedPlan === index && "pb-12"
                  )}>
                    {plan.features.slice(0, expandedPlan === index ? undefined : 8).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="size-4 !text-black/80" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.features.length > 8 && (
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 pt-8 pb-2 max-w-[90%] mx-auto",
                      expandedPlan === index ? "" : "bg-gradient-to-t from-white via-white/80 to-transparent"
                    )}>
                      <button
                        onClick={() => toggleExpand(index)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {expandedPlan === index ? (
                          <>
                            <ChevronUp className="size-4" />
                            <span>Ringkas</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="size-5" />
                            <span>Tampilkan Seluruhnya</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
              <Link href={plan?.popular ? "/payment" : "/apps"} className="w-full">                  <button
                    className={cn(
                      "w-full rounded-lg px-4 py-2",
                      plan?.popular
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full"
                        : "border border-gray-200 bg-white text-black rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:border-transparent",
                    )}
                  >
                    Mulai Sekarang
                  </button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
