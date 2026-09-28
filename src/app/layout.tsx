import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site, OG_IMAGE } from "@/lib/site";

/**
 * Inter Variable auto-alojada (100–900). Evita o pedido a fonts.googleapis.com,
 * elimina uma ligação de terceiros no caminho crítico e garante os pesos 800/900
 * usados na tipografia display.
 */
const inter = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `MODUS — ${site.tagline}`,
    template: "%s — MODUS",
  },
  description: site.description,
  keywords: [
    "construção civil",
    "arquitetura contemporânea",
    "moradias de alto padrão",
    "construção Coimbra",
    "reabilitação",
    "gestão de obra",
    "MODUS",
  ],
  authors: [{ name: "MODUS" }],
  creator: "MODUS",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: site.url,
    siteName: "MODUS",
    title: `MODUS — ${site.tagline}`,
    description: site.description,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Arquitetura MODUS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `MODUS — ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F0E9",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness", "GeneralContractor"],
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  slogan: site.tagline,
  image: `${site.url}${OG_IMAGE}`,
  priceRange: "€€€",
  areaServed: "Portugal",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    postalCode: site.address.postalCode,
    addressCountry: "PT",
  },
  sameAs: [site.social.instagram, site.social.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Saltar para o conteúdo
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
