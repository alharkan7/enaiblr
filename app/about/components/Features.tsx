import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { apps } from "@/config/apps";
import { ArrowUpRight } from "lucide-react";

const Features = () => {
  return (
    <section id="features" className="py-20 backdrop-blur-xs">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Fitur AI Unlimited
            </span> {" "}
            yang Kamu Butuhkan
          </h2>
          <p className="text-muted-foreground">
            Mulai dari produktivitas hingga kreativitas, platform kami punya semua tools dan fitur AI yang kamu butuhkan.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
        {apps.map((app) => (
            <Link
              key={app.slug}
              href={`/apps`}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[280px]"
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow cursor-pointer bg-white text-black group relative">
                <CardHeader>
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                    <app.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-12 h-12 text-sky-500" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
