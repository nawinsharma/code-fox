"use client";

import { HeroVideoSection } from "@/components/landing/sections/hero-video-section";
import { useAuthDialog } from "@/components/landing/auth-dialog";
import { siteConfig } from "@/lib/landing-config";

export function HeroSection() {
  const { hero } = siteConfig;
  const { open: openAuthDialog } = useAuthDialog();

  return (
    <section id="hero" className="w-full relative">
      <div className="relative flex flex-col items-center w-full px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 -z-10 h-[600px] md:h-[800px] w-full [background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,#dcfce7_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,var(--background)_40%,#166534_100%)] rounded-b-xl"></div>
        </div>
        <div className="relative z-10 pt-32 max-w-3xl mx-auto h-full w-full flex flex-col gap-10 items-center justify-center">
          <p className="border border-border bg-accent rounded-full text-sm h-8 px-3 flex items-center gap-2">
            {hero.badgeIcon}
            {hero.badge}
          </p>
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center text-primary">
              {hero.title}
            </h1>
            <p className="text-base md:text-lg text-center text-muted-foreground dark:text-white/80 font-medium text-balance leading-relaxed tracking-tight">
              {hero.description}
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <button
              onClick={openAuthDialog}
              className="bg-primary h-9 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground w-32 px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-primary/90 transition-all ease-out active:scale-95 cursor-pointer"
            >
              {hero.cta.primary.text}
            </button>
            <button
              onClick={openAuthDialog}
              className="h-10 flex items-center justify-center w-32 px-5 text-sm font-normal tracking-wide text-primary rounded-full transition-all ease-out active:scale-95 bg-white dark:bg-background border border-[#E5E7EB] dark:border-[#27272A] hover:bg-white/80 dark:hover:bg-background/80 cursor-pointer"
            >
              {hero.cta.secondary.text}
            </button>
            <a
              href="https://github.com/nawinsharma/code-fox/pull/10"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 flex items-center justify-center w-32 px-5 text-sm font-normal tracking-wide text-muted-foreground rounded-full transition-all ease-out active:scale-95 border border-border hover:bg-accent hover:text-foreground cursor-pointer"
            >
              See example
            </a>
          </div>
        </div>
      </div>
      <HeroVideoSection />
    </section>
  );
}
