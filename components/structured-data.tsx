interface StructuredDataProps {
  type: 'website' | 'webapplication' | 'organization';
  data?: Record<string, unknown>;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = 'https://codefox.nawin.xyz';

  const getStructuredData = (): Record<string, unknown> => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Code Fox",
          "description": "Automate your code reviews with AI. Connect your GitHub repositories and get instant, intelligent code review feedback on every pull request.",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/`
            },
            "query-input": "required name=search_term_string"
          },
          "sameAs": [
            "https://twitter.com/codefox",
            "https://github.com/codefox"
          ]
        };

      case 'webapplication':
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Code Fox",
          "description": "AI-powered code review platform for GitHub. Get instant, intelligent feedback on every pull request.",
          "url": baseUrl,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web Browser",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "AI Code Review",
            "GitHub Integration",
            "Pull Request Automation",
            "Code Quality Analysis",
            "Custom Review Rules"
          ],
          "screenshot": `${baseUrl}/opengraph-image`,
          "softwareVersion": "1.0.0",
          "author": {
            "@type": "Organization",
            "name": "Code Fox"
          }
        };

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Code Fox",
          "description": "AI-powered code review platform for GitHub.",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "sameAs": [
            "https://twitter.com/codefox",
            "https://github.com/codefox"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@codefox.dev"
          }
        };

      default:
        return {};
    }
  };

  const structuredData = data || getStructuredData();

  if (!structuredData || Object.keys(structuredData).length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}
