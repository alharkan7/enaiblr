import { Check } from "lucide-react";
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

const plans = [
  {
    name: "Gratis",
    price: "Rp0",
    description: "Cocok untuk Pengguna Baru",
    features: [
      "Chatbot AI tanpa History",
      "Image Generator Non-HD",
      "AI Search 1 Query/Hari",
      "Transcription 10 Menit",
    ],
  },
  {
    name: "All Access",
    price: "Rp49.000",
    description: "Akses Semua Fitur AI Lengkap",
    features: [
      "Unlimited Chatbot dengan History",
      "Unlimited Image Generator HD",
      "Unlimited AI Search Query",
      "Transcription 100 Menit",
      "Tutorial dan Akses Support",
    ],
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
  return (
    <section id="pricing" className="py-20 bg-muted/50">
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
                "relative flex flex-col h-full",
                plan.popular
                  ? "border-blue-600 shadow-lg scale-105"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    enaiblr
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="mb-4 text-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
                <ul className="space-y-2 max-w-[90%] mx-auto">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link href="/" className="w-full">
                  <button
                    className={cn(
                      "w-full rounded-lg px-4 py-2",
                      plan?.popular
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full"
                        : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 rounded-full",
                    )}>Mulai Sekarang</button>
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