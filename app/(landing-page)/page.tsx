export const metadata = {
  title: "Enaiblr - AI & Media Research Lab",
  description: "Page description",
};

import PageIllustration from "./components/page-illustration";
import Hero from "./components/hero-home";
import Workflows from "./components/workflows";
import Features from "./components/features";
import Testimonials from "./components/testimonials";
import Cta from "./components/cta";
import Header from "./components/ui/header";
import Footer from "./components/ui/footer";
import { auth } from "../(auth)/auth";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await auth();
  
  return (
    <div className={cn("font-['var(--font-nacelle)',var(--font-inter)] relative overflow-x-hidden bg-[#09090b]")}>
      <Header />
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
      <Cta />
      <Footer />
    </div>
  );
}
