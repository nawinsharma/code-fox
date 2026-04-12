import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { UsageProvider } from "@/components/providers/usage-provider";
import { Toaster } from "@/components/ui/sonner";
import StructuredData from "@/components/structured-data";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Code Fox - AI-Powered Code Review Platform",
		template: "%s | Code Fox",
	},
	description:
		"Automate your code reviews with AI. Connect your GitHub repositories and get instant, intelligent code review feedback on every pull request.",
	keywords: [
		"code review",
		"AI code review",
		"GitHub",
		"pull request",
		"automation",
		"code analysis",
		"developer tools",
		"code quality",
		"AI",
		"Code Fox",
	],
	authors: [
		{
			name: "Code Fox",
			url: "https://codefox.nawin.xyz",
		},
	],
	creator: "Code Fox",
	metadataBase: new URL("https://codefox.nawin.xyz"),
	openGraph: {
		type: "website",
		locale: "en_US",
		title: "Code Fox - AI-Powered Code Review Platform",
		description:
			"Automate your code reviews with AI. Connect your GitHub repositories and get instant, intelligent code review feedback on every pull request.",
		url: "https://codefox.nawin.xyz",
		siteName: "Code Fox",
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: "Code Fox - AI-Powered Code Review Platform",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Code Fox - AI-Powered Code Review Platform",
		description:
			"Automate your code reviews with AI. Connect your GitHub repositories and get instant, intelligent code review feedback on every pull request.",
		images: ["/twitter-image"],
		creator: "@codefox",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	category: "technology",
	other: {
		"msapplication-TileColor": "#10b981",
		"theme-color": "#10b981",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "default",
		"apple-mobile-web-app-title": "Code Fox",
		"application-name": "Code Fox",
		"mobile-web-app-capable": "yes",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
				<link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
				<link rel="manifest" href="/site.webmanifest" />
				<meta name="theme-color" content="#10b981" />
				<meta name="color-scheme" content="light dark" />
				<StructuredData type="website" />
				<StructuredData type="webapplication" />
				<StructuredData type="organization" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<QueryProvider>
					<ThemeProvider
						attribute={"class"}
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						<UsageProvider>
							{children}
						</UsageProvider>
						<Toaster richColors />
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
