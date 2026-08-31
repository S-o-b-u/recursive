"use client";

import FaqSection, { type FaqData } from "@/components/ui/habit-faq-scroller";
import { FAQS } from "@/data/hackathon";

export default function HomeFAQ() {
  const faqData: FaqData = {
    mainTitle: "Frequently Asked Questions",
    mainSubtitle:
      "Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.",
    rows: [
      {
        id: "row1",
        speed: "50s",
        direction: "left",
        faqItems: [
          {
            id: "q1",
            question: FAQS[0].q,
            answer: FAQS[0].a,
          },
          {
            id: "q2",
            question: FAQS[1].q,
            answer: FAQS[1].a,
          },
          {
            id: "q3",
            question: FAQS[2].q,
            answer: FAQS[2].a,
          },
          {
            id: "q4",
            question: FAQS[3].q,
            answer: FAQS[3].a,
          },
        ],
      },
      {
        id: "row2",
        speed: "42s",
        direction: "right",
        faqItems: [
          {
            id: "q5",
            question: FAQS[4].q,
            answer: FAQS[4].a,
          },
          {
            id: "q6",
            question: FAQS[5].q,
            answer: FAQS[5].a,
          },
          {
            id: "q7",
            question: FAQS[6].q,
            answer: FAQS[6].a,
          },
          {
            id: "q8",
            question: FAQS[7].q,
            answer: FAQS[7].a,
          },
        ],
      },
      {
        id: "row3",
        speed: "55s",
        direction: "left",
        faqItems: [
          {
            id: "q9",
            question: "Is there mentorship available?",
            answer:
              "Yes! Mentors from industry and research will be on the floor throughout the event to help with architecture, debugging, and pitch coaching.",
          },
          {
            id: "q10",
            question: FAQS[0].q,
            answer: FAQS[0].a,
          },
          {
            id: "q11",
            question: FAQS[5].q,
            answer: FAQS[5].a,
          },
          {
            id: "q12",
            question: FAQS[1].q,
            answer: FAQS[1].a,
          },
        ],
      },
    ],
  };

  return <FaqSection data={faqData} />;
}
