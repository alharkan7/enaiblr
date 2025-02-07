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
    question: "How long is my Affiliate code valid?",
    answer: "Your Affiliate code has no expiration date, so you can use it as a <b>passive income</b>. You'll continue earning commissions as long as users subscribe using your referral code."
  },
  {
    question: "Can I earn commission from subscription renewals?",
    answer: "Yes, you'll receive a <b>25% commission every time your referral code is used</b> for an Enaiblr Pro subscription transaction, including renewals. So if a user renews their subscription in the second month and beyond, you'll <b>continuously</b> earn 25% commission from their transactions."
  },
  {
    question: "How do I withdraw my commission funds?",
    answer: "You can withdraw your commission funds anytime through the <a href='/account/affiliate' class='text-yellow-500 hover:text-yellow-700 underline'>Affiliate dashboard</a> by clicking the '<b>Withdraw Earnings</b>' button. From there, you'll be directed to Admin where you can provide your bank details and account number for the withdrawal. After that, just wait for your funds to arrive after processing."
  },
  {
    question: "Is there a limit to how many referrals I can get?",
    answer: "No, there isn't. The more users who make transactions using your referral code, the more commission earnings you'll receive."
  },
  {
    question: "What payment methods are available for commission withdrawals?",
    answer: "We support various common payment methods including bank transfers, e-wallets, and other digital payment methods. If you have any questions, you can ask Admin on the <a href='/account/affiliate' class='text-yellow-500 hover:text-yellow-700 underline'>Affiliate</a> page."
  },
  {
    question: "How long does the commission withdrawal process take?",
    answer: "The withdrawal process usually completes within 1 business day after you submit your withdrawal request through the Affiliate dashboard. We can process quickly as long as all successful transactions have been verified."
  },
  {
    question: "Can I view my commission history?",
    answer: "Yes, you can view all your transaction history, commissions, and payment status through the <a href='/account/affiliate' class='text-yellow-500 hover:text-yellow-700 underline'>Affiliate dashboard</a>."
  },
  {
    question: "How do I customize my referral code?",
    answer: "On the <a href='/account/affiliate' class='text-yellow-500 hover:text-yellow-700 underline'>Affiliate page</a>, you'll find an option to customize your referral code according to your preference. Make sure the code you choose is unique and easy to share."
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
              <span className="bg-gradient-to-r from-yellow-500 to-orange-600 bg-[length:200%_100%] bg-clip-text text-transparent"
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
                <span>{showAll ? 'Show Less' : 'Show More'}</span>
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
