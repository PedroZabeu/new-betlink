import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/cookie-consent";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BetLink - Conectando Tipsters de Elite aos Melhores Apostadores",
  description: "A plataforma líder em conectar apostadores a tipsters profissionais verificados. Transparência, segurança e resultados comprovados.",
  keywords: ["tipsters", "apostas esportivas", "tips", "apostas", "telegram", "profissionais verificados"],
  authors: [{ name: "BetLink" }],
  creator: "BetLink",
  publisher: "BetLink",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: defaultUrl,
    title: "BetLink - Conectando Tipsters de Elite aos Melhores Apostadores",
    description: "A plataforma líder em conectar apostadores a tipsters profissionais verificados. Transparência, segurança e resultados comprovados.",
    siteName: "BetLink",
  },
  twitter: {
    card: "summary_large_image",
    title: "BetLink - Conectando Tipsters de Elite aos Melhores Apostadores",
    description: "A plataforma líder em conectar apostadores a tipsters profissionais verificados. Transparência, segurança e resultados comprovados.",
    creator: "@betlink",
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
  verification: {
    google: "google-site-verification-code",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieBanner />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
