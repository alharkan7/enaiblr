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

export default function Home() {
  return (
    <>
      <Header />
      <PageIllustration />
      <Hero />
      <Workflows />
      <Features />
      <Testimonials />
      <Cta />
      <Footer />
    </>
  );
}
