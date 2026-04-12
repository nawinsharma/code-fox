/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/lib/landing-config";

export function QuoteSection() {
  const { quoteSection } = siteConfig;

  return (
    <section
      id="quote"
      className="flex flex-col items-center justify-center gap-8 w-full p-14 bg-primary z-20"
    >
      <blockquote className="max-w-3xl text-left px-4">
        <p className="text-xl md:text-2xl text-white/90 leading-relaxed tracking-tighter font-medium mb-6">
          {quoteSection.quote}
        </p>

        <div className="flex gap-4">
          <div className="size-10 rounded-full border border-white/20">
            <img
              src={quoteSection.author.image}
              alt={quoteSection.author.name}
              className="size-full rounded-full object-contain"
            />
          </div>
          <div className="text-left">
            <cite className="text-lg font-medium text-white not-italic">
              {quoteSection.author.name}
            </cite>
            <p className="text-sm text-white/70">{quoteSection.author.role}</p>
          </div>
        </div>
      </blockquote>
    </section>
  );
}
