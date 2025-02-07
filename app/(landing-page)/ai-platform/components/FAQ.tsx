"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const faqItems = [{
  question: "What AI models are available on the Enaiblr Platform?",
  answer: "GPT-4o (OpenAI), Claude 3.5 Sonnet (Anthropic), Gemini 1.5 (Google), Llama 3 (Meta), DeepSeek, Qwen 2.5 (Alibaba), Mixtral 8x (Mistral), and Gemma 2 (Google).",
},
{
  question: "Is this a shared account system?",
  answer: "No. Users can <a href='/login' class='text-blue-600 hover:text-blue-800 underline'>login</a> using their individual Google accounts to avoid account sharing.",
},
{
  question: "How can Enaiblr's AI packages be cheaper than their original prices?",
  answer: "We use API (Application Program Interfaces) systems from each AI provider, which are more cost-effective on-demand compared to monthly subscription prices.",
},
{
  question: "Is it really unlimited?",
  answer: "Yes. There are no limits on the number of files, documents, and images you can upload to Enaiblr. The only restrictions are on individual file sizes, which depend on the application being used and the limitations of each AI provider.",
},
{
  question: "What AI applications are available on Enaiblr?",
  answer: "Unlimited AI Chat, HD Image Generator, Private Document Chat, Incognito Chat, Web Search, AI Tools Search Engine, Audio Transcriber, AI Natural Voice, and more. You can try them all on our <a href='/apps' class='text-blue-600 hover:text-blue-800 underline'>Apps page</a>. We'll continue adding more AI applications to our platform at no additional cost.",
},
{
  question: "What can Enaiblr's AI Chat do?",
  answer: "All the capabilities of ChatGPT, Claude, and Gemini are available on the Enaiblr platform, including writing, coding, translation, reviews, brainstorming, and more. Additionally, Enaiblr AI features chat organization with Folders and Pins, as well as document creation and Python code execution capabilities similar to ChatGPT's Canvas or Claude's Artifacts.",
},
{
  question: "What advantages does Enaiblr have over other platforms?",
  answer: "Enaiblr is the most affordable AI platform offering unlimited AI capabilities. It includes Document Creator & Editor features similar to ChatGPT's Canvas and Claude's Artifacts. Enaiblr also allows Python code execution within chats. Moreover, our chat organization features with Folders and Pins are currently not available on platforms like ChatGPT, Claude, and Gemini.",
},
{
  question: "What are the usage limits for free accounts?",
  answer: "For AI Chat, free accounts can access 4 out of 6 AI models (excluding GPT-4o and Claude) and use chat organization features like Folders and Pins. For other applications besides Chat, free accounts can try all features with some limitations.",
},
{
  question: "Is there an affiliate program?",
  answer: "Yes. Please visit our <a href='/affiliate' class='text-blue-600 hover:text-blue-800 underline'>Affiliate</a> page or contact us via Email at <a href='mailto:mail@enaiblr.org' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:text-blue-800 underline'>+62-812-8007-7690</a> to register for the Enaiblr Affiliate program. We offer a <b>25%</b> commission up to <b>Rp25,000</b> per successful transaction.",
},
{
  question: "Is my data secure?",
  answer: "Absolutely. Our security features include SSL/TLS encryption, Secure Password Enforcement, Login with Google, and networking security services from our server and database providers.",
},
{
  question: "What file formats are supported on Enaiblr?",
  answer: "We support common image formats like JPEG, PNG, and common document types like PDF, DOC. In our specialized Doc Chat application, our AI can also read TXT, MD, CSS, and HTML files.",
},
{
  question: "What payment methods are available on Enaiblr?",
  answer: "We support payments through QRIS, e-Wallets (ShopeePay, DANA, etc.), Bank Transfer (Mandiri, BNI, BRI, etc.), and Retail Marts (Indomaret, Alfamart).",
},
{
  question: "What happens when my subscription package expires?",
  answer: "When your Enaiblr Pro subscription ends after one period, you can <a href='/account/profile' class='text-blue-600 hover:text-blue-800 underline'>renew</a> it for the next period. Don't worry, your data remains stored even if you haven't renewed your subscription yet.",
},
{
  question: "I'm having issues activating my Enaiblr Pro account after payment, what should I do?",
  answer: "If you're experiencing issues with Enaiblr Pro activation, you can contact us via Email at <a href='mailto:mail@enaiblr.org' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:text-blue-800 underline'>mail@enaiblr.org</a>. We'll promptly handle the activation and help resolve any related issues.",
},
{
  question: "Is there a smartphone app?",
  answer: "You can install Enaiblr as a Web App by opening enaiblr.org in Google Chrome, then from the browser menu, select 'Add to Home Screen'. After that, you can use all Enaiblr Apps just like a regular Android application.",
}
]

const createMarkup = (content: string) => {
  return { __html: content };
};

const FAQ = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? faqItems : faqItems.slice(0, 7);

  return (
    <section id="faq" className="max-w-6xl mx-auto w-full py-12 md:py-20 lg:py-20 bg-white rounded-lg shadow-lg mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container px-4 md:px-6"
      >
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div variants={item} className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold text-black-900 tracking-tighter sm:text-3xl md:text-4xl">
              Frequently Asked {' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Questions
              </span>
            </h2>
          </motion.div>
          <motion.div variants={item} className="w-full max-w-[700px] space-y-4">
            <div className={`relative ${!showAll ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-32 after:bg-gradient-to-t after:from-white after:to-transparent after:pointer-events-none' : ''}`}>
              <Accordion type="single" collapsible className="w-full">
                {displayedItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 text-left">
                      <div dangerouslySetInnerHTML={createMarkup(item.answer)} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            {faqItems.length > 7 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-6 px-6 py-2 text-lg font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 mx-auto relative z-10"
              >
                <ChevronDown className={`size-5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                <span>{showAll ? 'Show Less' : 'Show All'}</span>
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
