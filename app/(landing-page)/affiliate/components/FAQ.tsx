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

const createMarkup = (content: string) => {
  return { __html: content };
};

const faqItems = [
  {
    question: "Berapa lama masa berlaku kode Affiliate saya?",
    answer: "Kode Affiliate kamu tidak memiliki batasan masa berlaku, jadi kamu bisa menjadikannya sebagai <b>passive income</b>. Kamu dapat terus mendapatkan komisi selama ada pengguna yang menggunakan kode referral-mu untuk berlangganan."
  },
  {
    question: "Apakah saya bisa mendapatkan komisi dari perpanjangan berlangganan?",
    answer: "Ya, kamu akan mendapatkan komisi <b>25% setiap kali kode referral-mu digunakan</b> dalam transaksi berlangganan Enaiblr Pro, termasuk perpanjangan. Jadi apabila seorang pengguna memperpanjang subscription di bulan kedua dst., kamu akan mendapatkan komisi 25% dari transaksi mereka <b>terus-menerus</b>."
  },
  {
    question: "Bagaimana cara mencairkan dana komisi?",
    answer: "Kamu dapat mencairkan dana komisi kapan saja melalui <a href='/account/affiliate' class='text-blue-600 hover:text-blue-800 underline'>dashboard Affiliate</a> dengan mengklik tombol '<b>Withdraw Earnings</b>'. Dari sana, kamu akan diarahkan ke Admin, kemudian sampaikan Bank dan nomor rekening tujuan untuk pencairan danamu. Setelah itu, tinggal tunggu danamu masuk setelah segera diproses."
  },
  {
    question: "Apakah ada batasan jumlah referral yang bisa saya dapatkan?",
    answer: "Tidak ada. Semakin banyak pengguna yang melakukan transaksi menggunakan kode referral-mu, semakin besar pula penghasilan dari komisi yang akan kamu terima."
  },
  {
    question: "Metode pembayaran apa saja yang tersedia untuk pencairan komisi?",
    answer: "Kami mendukung berbagai metode pembayaran umum seperti transfer bank, e-wallet, dan metode pembayaran digital lainnya. Jika ada pertanyaan, bisa ditanyakan ke Admin di halaman <a href='/account/affiliate' class='text-blue-600 hover:text-blue-800 underline'>Affiliate</a>."
  },
  {
    question: "Berapa lama proses pencairan dana komisi?",
    answer: "Proses pencairan dana biasanya selesai dalam waktu 1 hari kerja sejak kamu mengajukan penarikan dana melalui dashboard Affiliate. Kami dapat mencairkan secara cepat selama setiap transaksi yang sukses telah terverifikasi."
  },
  {
    question: "Apakah saya bisa melihat riwayat komisi saya?",
    answer: "Ya, kamu dapat melihat seluruh riwayat transaksi, komisi, dan status pembayaran melalui <a href='/account/affiliate' class='text-blue-600 hover:text-blue-800 underline'>dashboard Affiliate</a>."
  },
  {
    question: "Bagaimana cara meng-kustomisasi kode referral?",
    answer: "Di <a href='/account/affiliate' class='text-blue-600 hover:text-blue-800 underline'>halaman Affiliate</a>, kamu akan menemukan opsi untuk mengedit kode referral secara custom sesuai keinginanmu. Pastikan kode yang kamu pilih unik dan mudah dibagikan."
  }
];

const FAQ = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedItems = showAll ? faqItems : faqItems.slice(0, 5);

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
            {faqItems.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-6 px-6 py-2 text-base font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 mx-auto relative z-10"
              >
                <ChevronDown className={`size-5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                <span>{showAll ? 'Tampilkan Ringkas' : 'Tampilkan Seluruhnya'}</span>
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
