"use client";

import { motion } from "framer-motion";
import { Zap, Wallet, DollarSign, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "Mudah Dijual",
    description: "Produk software AI sedang sangat ramai pengguna, dan Enaiblr adalah yang paling murah dengan fitur paling lengkap, sehingga akan mudah dijual."
  },
  {
    icon: Zap,
    title: "Pemasukan Instan",
    description: "Tak seperti produk fisik yang menunggu pengiriman, penghasilan Enaiblr Affiliate akan seketika masuk di setiap transaksi yang berhasil."
  },
  {
    icon: DollarSign,
    title: "Nilai Komisi Tinggi",
    description: "Nilai komisi kami tinggi sebesar 25% hingga Rp25.000 per transaksi adalah di atas rata-rata komisi program affiliate pada umumnya."
  },
  {
    icon: Wallet,
    title: "Tanpa Minimum Pencairan Dana",
    description: "Berbeda dengan affiliate lain yang memiliki minimum target atau periode tertentu, pencairan dana Enaiblr Affiliate bisa kapanpun dan berapapun."
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
            Apa Saja {" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Keuntungannya?
            </span>
          </h2>
          <p className="text-gray-500 mx-auto text-lg max-w-3xl">
            Berbeda dengan program program referral lain, <b>Enaiblr Affiliate</b> memiliki nilai komisi tinggi, fleksibel, instan, dan tanpa batas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="flex gap-6 items-start p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300">
                <div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
