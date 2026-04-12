"use client";

import { BentoSection } from "@/components/landing/sections/bento-section";
import { CompanyShowcase } from "@/components/landing/sections/company-showcase";
import { CTASection } from "@/components/landing/sections/cta-section";
import { FAQSection } from "@/components/landing/sections/faq-section";
import { FeatureSection } from "@/components/landing/sections/feature-section";
import { FooterSection } from "@/components/landing/sections/footer-section";
import { GrowthSection } from "@/components/landing/sections/growth-section";
import { HeroSection } from "@/components/landing/sections/hero-section";
import { PricingSection } from "@/components/landing/sections/pricing-section";
import { QuoteSection } from "@/components/landing/sections/quote-section";
import { TestimonialSection } from "@/components/landing/sections/testimonial-section";
import { Navbar } from "@/components/landing/sections/navbar";
import { AuthDialogProvider } from "@/components/landing/auth-dialog";

export function LandingPage() {
	return (
		<AuthDialogProvider>
			<div className="max-w-7xl mx-auto border-x relative">
				<div className="block w-px h-full border-l border-border absolute top-0 left-6 z-10"></div>
				<div className="block w-px h-full border-r border-border absolute top-0 right-6 z-10"></div>
				<Navbar />
				<main className="flex flex-col items-center justify-center divide-y divide-border min-h-screen w-full">
					<HeroSection />
					<CompanyShowcase />
					<BentoSection />
					<QuoteSection />
					<FeatureSection />
					<GrowthSection />
					<PricingSection />
					<TestimonialSection />
					<FAQSection />
					<CTASection />
					<FooterSection />
				</main>
			</div>
		</AuthDialogProvider>
	);
}
