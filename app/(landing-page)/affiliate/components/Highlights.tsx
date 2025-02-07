"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import hl1 from "../assets/hl-1.webp";
import hl2 from "../assets/hl-2.webp";
import hl3 from "../assets/hl-3.webp";
import hl4 from "../assets/hl-4.webp";

const features = [
  {
    title: "Login and Open the Affiliate Page",
    subtitle: "Go to the <a href=/account/affiliate style='color: #f59e0b; text-decoration: underline; hover:text-decoration: none;'>Affiliate</a> page to access your referral code or register if you don't have an account yet.",
    image: hl1
  },
  {
    title: "Share Your Affiliate Link & Code",
    subtitle: "Copy and share your referral code with your followers, friends, or connections. You can customize your referral code to better suit your brand.",
    image: hl2
  },
  {
    title: "Track Your Earnings on Dashboard", 
    subtitle: "Every time someone successfully subscribes to <b>Enaiblr Pro Access</b> using your referral code, you'll automatically earn a <b>25%</b> commission. No limit on number of transactions.",
    image: hl3
  },
  {
    title: "Withdraw Funds Anytime",
    subtitle: "You can withdraw your funds anytime, with no minimum amount. Just click the 'Withdraw Earnings' button, and our Admin will process your withdrawal right away.",
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
            How{" "}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              It Works
            </span>
          </h2>
          <p className="text-gray-500 mx-auto max-w-3xl text-lg">
            Follow these 4 easy steps to join <b>Enaiblr Affiliate</b> right now.
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
