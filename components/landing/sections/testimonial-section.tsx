import { SectionHeader } from "@/components/landing/section-header";
import { SocialProofTestimonials } from "@/components/landing/testimonial-scroll";
import { siteConfig } from "@/lib/landing-config";

export function TestimonialSection() {
  const { testimonials } = siteConfig;

  return (
    <section
      id="testimonials"
      className="flex flex-col items-center justify-center w-full"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
          Loved by Engineering Teams
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          See what developers and engineering leaders are saying about
          AI-powered code reviews with Code Horse.
        </p>
      </SectionHeader>
      <SocialProofTestimonials testimonials={testimonials} />
    </section>
  );
}
