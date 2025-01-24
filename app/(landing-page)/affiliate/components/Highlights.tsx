"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import hl1 from "../assets/hl-1.webp";
import hl2 from "../assets/hl-2.webp";
import hl3 from "../assets/hl-3.webp";
import hl4 from "../assets/hl-4.webp";

const features = [
  {
    title: "Login dan Buka Halaman Affiliate",
    subtitle: "Masuk ke laman <a href=/account/affiliate style='color: #f59e0b; text-decoration: underline; hover:text-decoration: none;'> Affiliate</a> untuk mengakses kode referral kamu atau register terlebih dulu jika belum memiliki akun.",
    image: hl1
  },
  {
    title: "Bagikan Link & Kode Affiliate-mu",
    subtitle: "Copy dan bagikan kode referral-mu ke followers, teman-teman, atau koneksi yang kamu punya. Kamu juga bisa meng-customize kode referral-mu sesuai yang kamu mau.",
    image: hl2
  },
  {
    title: "Pantau Pendapatanmu di Dashboard",
    subtitle: "Setiap mereka berhasil melakukan subscription <b>Enaiblr Pro Akses 4 Bulan</b> dengan kode referral-mu, maka kamu otomatis akan mendapatkan komisi <b>25%</b> hingga <b>Rp25.000</b>. Tanpa limit jumlah transaksi.",
    image: hl3
  },
  {
    title: "Tarik Dana Kapan Saja",
    subtitle: "Kamu bisa menarik danamu kapan saja, tanpa minimum nilai. Tinggal klik tombol 'Withdraw Earnings', maka Admin kami akan segera memproses pencairan danamu.",
    image: hl4
  },
];

const Highlights = () => {
  return (
    <section id="highlights" className="py-24 overflow-hidden">
      <div className="container px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
            Bagaimana{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Caranya?
            </span>
          </h2>
          <p className="text-gray-500 mx-auto max-w-3xl text-lg">
            Ikuti 4 langkah mudah berikut untuk langsung bergabung di <b>Enaiblr Affiliate</b>.
          </p>
        </motion.div>
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center w-full`}
            >
              <motion.div 
                className="w-full lg:w-1/2 max-w-full"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.3 }}
              >
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                  {feature.title}
                </h2>
                <p 
                  className="mt-3 text-gray-600 text-lg"
                  dangerouslySetInnerHTML={{ __html: feature.subtitle }}
                />
              </motion.div>
              <div className="w-full lg:w-1/2">
                <motion.div 
                  className="relative w-full outline outline-2 outline-yellow-500 shadow-lg aspect-[4/3] rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
