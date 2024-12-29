import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Jadikan
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Produktivitas Meroket?
            </span> {" "}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Gabung sekarang untuk membuka akses ke seluruh fitur AI tanpa batas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full" asChild>
              <Link href="/">
                Akses Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <a href="https://wa.me/+6281280077690" target="_blank" rel="noopener noreferrer">Hubungi Admin</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;