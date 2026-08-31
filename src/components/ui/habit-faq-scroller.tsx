import React from 'react';

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

export interface FaqRow {
  id: string;
  speed?: string;
  direction?: 'left' | 'right';
  faqItems: FaqItem[];
}

export interface FaqData {
  mainTitle: string;
  mainSubtitle: string;
  rows: FaqRow[];
}

/**
 * FaqCard
 * Reusable card for a single FAQ item.
 */
export const FaqCard = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <div className="flex flex-col items-start justify-start gap-3 p-6 sm:p-7 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] w-[22rem] sm:w-[24rem] md:w-[26rem] h-[175px] sm:h-[190px] flex-shrink-0 faq-card text-left transition-transform duration-300 hover:-translate-y-1">
      <h3 className="text-lg sm:text-xl font-bold text-black faq-title tracking-tight leading-snug">{question}</h3>
      <p className="text-sm sm:text-base text-gray-600 faq-answer leading-relaxed line-clamp-4">{answer}</p>
    </div>
  );
};

/**
 * HorizontalScroller
 * Wraps children and creates a seamless horizontal looping animation.
 */
export const HorizontalScroller = ({
  children,
  speed = '40s',
  direction = 'left',
}: {
  children: React.ReactNode;
  speed?: string;
  direction?: 'left' | 'right';
}) => {
  const animationClass =
    direction === 'right' ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal';

  // Inline style to set the CSS custom property for scroll duration.
  const style = { '--scroll-duration': speed } as React.CSSProperties;

  return (
    <div className="w-full overflow-hidden group relative scroller-mask py-2">
      <div className={`flex ${animationClass}`} style={style}>
        <div className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-4">
          {children}
        </div>
        {/* duplicate for seamless loop */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * FaqSection
 * Assembles title, subtitle, and multiple horizontal rows.
 */
const FaqSection = ({ data }: { data: FaqData }) => {
  return (
    <section id="faq" className="relative flex flex-col items-center gap-10 md:gap-14 py-16 sm:py-20 md:py-28 w-full overflow-hidden bg-gradient-to-b from-white via-[#f0f4ff] to-[#dbe4ff] scroll-mt-20">
      <div className="flex flex-col items-center gap-4 text-center z-10 max-w-2xl px-4">
        <h2 className="text-4xl sm:text-5xl font-bold text-black leading-tight tracking-tight">
          {data.mainTitle}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          {data.mainSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 z-10 w-full">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item, idx) => (
              <FaqCard key={item.id || idx} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
