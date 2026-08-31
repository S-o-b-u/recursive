"use client";

import FaqSection, { type FaqData } from "@/components/ui/habit-faq-scroller";
import { FAQS } from "@/data/hackathon";

export default function HomeFAQ() {
  const row1 = [FAQS[0], FAQS[1], FAQS[2], FAQS[3]].map((f, i) => ({
    id: `r1-${i}`,
    question: f.q,
    answer: f.a,
  }));

  const row2 = [FAQS[4], FAQS[5], FAQS[6], FAQS[7]].map((f, i) => ({
    id: `r2-${i}`,
    question: f.q,
    answer: f.a,
  }));

  const row3 = [FAQS[2], FAQS[4], FAQS[0], FAQS[6]].map((f, i) => ({
    id: `r3-${i}`,
    question: f.q,
    answer: f.a,
  }));

  const faqData: FaqData = {
    mainTitle: "Frequently Asked Questions",
    mainSubtitle:
      "Everything you might want to know before claiming your seat. If you have any other questions,",
    rows: [
      {
        id: "faq-row-1",
        speed: "36s",
        direction: "left",
        faqItems: row1,
      },
      {
        id: "faq-row-2",
        speed: "42s",
        direction: "right",
        faqItems: row2,
      },
      {
        id: "faq-row-3",
        speed: "38s",
        direction: "left",
        faqItems: row3,
      },
    ],
  };

  return <FaqSection data={faqData} />;
}
