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
  question: "Apa saja model AI yang ada di Enaiblr Platform?",
  answer: "GPT-4o (OpenAI), Claude 3.5 Sonnet (Anthropic), Gemini 1.5 (Google), Llama 3 (Meta), Mixtral 8x (Mistral), dan Gemma 2 (Google).",
},
{
  question: "Apakah ini sharing account?",
  answer: "Tidak. User bisa login menggunakan akun Google masing-masing untuk menghindari sharing account.",
},
{
  question: "Bagaimana paket AI di Enaiblr bisa lebih murah dibandingkan dengan harga asalnya?",
  answer: "Kami menggunakan sistem API (Application Program Interfaces) dari masing-masing provider AI yang mana harganya lebih murah secara on-demand dibandingkan dengan harga subscription bulanan.",
},
{
  question: "Apakah benar-benar unlimited?",
  answer: "Ya. Tidak ada batasan jumlah file, dokumen, dan gambar yang dapat di-upload di Enaiblr. Batasan hanya pada ukuran satuan file tergantung pada aplikasi yang digunakan dan keterbatasan provider AI masing-masing.",
},
{
  question: "Apa saja aplikasi AI yang ada di Enaiblr?",
  answer: "Unlimited AI Chat, Image Generator HD, Private Document Chat, Incognito Chat, Web Search, AI Tools Search Engine, Audio Transcriber, AI Natural Voice, dll. Kamu dapat mencoba semuanya di halaman Apps setelah login. Kami juga akan terus menambah jumlah aplikasi AI di platform kami tanpa tambahan biaya.",
},
{
  question: "Apa saja yang bisa dilakukan oleh AI Chat di Enaiblr?",
  answer: "Semua kapabilitas AI pada ChatGPT, Claude, dan Gemini dapat dilakukan di platform Enaiblr, seperti menulis, coding, penerjemahan, review, brainstorming, dll. Selain itu, Enaiblr AI juga memiliki fitur organisasi chat dengan Folder dan Pin, serta fitur pembuatan dokumen dan running Python code seperti Canvas pada ChatGPT atau Artifact pada Claude.",
},
{
  question: "Apa kelebihan Enaiblr dibandingkan dengan platform lain?",
  answer: "Enaiblr adalah AI platform paling terjangkau yang menawarkan seluruh kapabilitas AI tanpa batas. Enaiblr juga memiliki fitur Document Creator & Editor seperti Canvas pada ChatGPT dan Artifact pada Claude. Enaiblr juga memiliki fitur untuk menjalankan Python code di dalam chat. Bahkan, fitur organisasi chat dengan Folder dan Pin saat ini masih belum dimiliki oleh AI seperti ChatGPT, Claude, dan Gemini.",
},
{
  question: "Berapa limit penggunaan akun gratis?",
  answer: "Untuk AI Chat, akun gratis bisa menggunakan 4 dari 6 AI model yang tersedia selain GPT-4o dan Claude, serta menggunakan fitur organisir chat seperti Folder dan Pin. Untuk aplikasi lain selain Chat, akun gratis dapat mencoba semua fiturnya dengan beberapa batasan.",
},
{
  question: "Apakah ada program affiliate?",
  answer: "Ada. Silakan menghubungi WhatsApp kami di +62-812-8007-7690 untuk mendaftar di program Enaiblr Affiliate. Kami menawarkan komisi hingga Rp25.000 per transaksi yang berhasil.",
},
{
  question: "Apakah data saya aman?",
  answer: "Tentu saja. Beberapa fitur keamanan yang kami implementasikan antara lain: Enskripsi SSL/TLS, Secure Password Enforcement, Login with Google, serta dukungan layanan keamanan networking dari provider server dan database kami.",
},
{
  question: "Apa saja format file yang didukung di Enaiblr?",
  answer: "Kami mendukung file gambar umum seperti JPEG, PNG, serta jenis dokumen umum seperti PDF, DOC. Pada aplikasi Doc Chat khusus, AI kami juga dapat membaca file TXT, MD, CSS, hingga HTML.",
},
{
  question: "Metode pembayaran apa saja yang tersedia di Enaiblr?",
  answer: "Kami mendukung pembayaran menggunakan QRIS, e-Wallet (ShopeePay, DANA, dll.), Bank Transfer (Mandiri, BNI, BRI, dll.), serta via Retail Mart (Indomaret, Alfamart).",
},
{
  question: "Bagaimana jika paket langganan saya telah habis?",
  answer: "Apabila langganan Enaiblr Pro kamu sudah habis setelah satu periode, kamu dapat memperpanjang subscription untuk periode berikutnya. Tenang, data kamu tetap tersimpan meskipun kamu belum sempat untuk memperpanjang subscription.",
},
{
  question: "Saya mengalami kendala aktivasi akun Enaiblr Pro setelah melakukan pembayaran, apa yang harus saya lakukan?",
  answer: "Apabila ada kendala aktivasi Enaiblr Pro, kamu bisa menghubungi WhatsApp kami di +62-812-8007-7690. Kami akan segera melakukan aktivasi dan membantu menyelesaikan kendala terkait.",
},
{
  question: "Apakah ada aplikasinya di smartphone?",
  answer: "Kamu bisa menginstall Enaiblr sebagai Web App dengan cara membuka enaiblr.org di Google Chrome, kemudian dari menu browser, pilih 'Add to Home Screen' ('Tambahkan ke Layar Utama'). Setelah itu, kamu bisa menggunakan semua Enaiblr Apps seperti aplikasi Android pada umumnya.",
}
]

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
                      {item.answer}
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
                <span>{showAll ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Seluruhnya'}</span>
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
