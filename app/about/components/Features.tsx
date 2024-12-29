import { ScanSearch, MessageCircleQuestion, WandSparkles, FileAudio, Speech, Lightbulb, LayoutGrid } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: "AI Search Engine",
    description:
      "Fitur pencarian yang simple and straightforward untuk menemukan tools and resources AI terbaik.",
    icon: ScanSearch,
  },
  {
    title: "Smart Chatbot",
    description:
      "Chatbot AI cerdas dan user-friendly dengan fitur image attachment tanpa batas.",
    icon: MessageCircleQuestion,
  },
  {
    title: "Image Creator",
    description:
      "Buat gambar AI dalam kualitas HD dengan beragam style artistik secara custom dan cepat.",
    icon: WandSparkles,
  },
  {
    title: "Audio Transcription",
    description:
      "Transkripsi audio menjadi teks untuk memudahkan analisis dan pengolahan informasi.",
    icon: FileAudio,
  },
  {
    title: "Text to Voice",
    description:
      "Ubah teks menjadi suara alami seperti manusia, cocok untuk video presentasi atau media sosial.",
    icon: Speech,
  },
  {
    title: "Smart Browsing",
    description:
      "AI cerdas yang mampu merangkum informasi akurat & up-to-date dari Internet",
    icon: Lightbulb,
  },
  {
    title: "Bonus Features",
    description:
      "Fitur AI akan terus ditambahkan gratis, seperti Data Visualization, Research Assistant, dll.",
    icon: LayoutGrid,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Fitur AI Lengkap
            </span> {" "}
            yang Kamu Butuhkan
          </h2>
          <p className="text-muted-foreground">
            Mulai dari produktivitas hingga kreativitas, platform kami punya semua tools dan fitur AI yang kamu butuhkan.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-none shadow-lg w-full md:w-[calc(50%-1rem)] lg:w-[280px]"
            >
              <CardHeader>
                <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
