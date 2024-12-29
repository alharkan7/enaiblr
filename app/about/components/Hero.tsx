import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Akses Seluruh {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              AI Tanpa Batas
            </span>{" "}
            dalam Satu Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tingkatkan produktivitasmu dengan akses ke beragam jenis AI dalam satu akun. Harga terjangkau, tak perlu lagi membayar langganan satu per satu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#features">
              <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full">
                Mulai <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full">
                Lihat Fitur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;