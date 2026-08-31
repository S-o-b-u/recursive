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
 * Reusable card for a single FAQ item with pristine typography, spacing, and elevation.
 */
export const FaqCard = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <div className="flex flex-col items-start justify-start gap-2.5 p-6 sm:p-7 bg-white/95 backdrop-blur-md rounded-2xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] w-[300px] sm:w-[360px] md:w-[410px] min-h-[160px] sm:min-h-[175px] flex-shrink-0 faq-card text-left transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:border-black/20">
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 faq-title tracking-tight leading-snug">
        {question}
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 faq-answer leading-relaxed">
        {answer}
      </p>
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
        {/* Set 1 */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-3 sm:px-4">
          {children}
        </div>
        {/* duplicate for seamless loop */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-3 sm:px-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * FaqSection
 * Assembles title, subtitle, and multiple horizontal rows on the global cloudy background.
 */
const FaqSection = ({ data }: { data: FaqData }) => {
  return (
    <section id="faq" className="relative flex flex-col items-center gap-10 md:gap-14 py-20 sm:py-24 md:py-32 w-full overflow-hidden bg-transparent scroll-mt-20 z-10">
      <div className="flex flex-col items-center gap-3 sm:gap-4 text-center z-10 max-w-2xl px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
          {data.mainTitle}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-xl">
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
